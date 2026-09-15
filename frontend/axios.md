# Axios Configuration

This file contains the Axios configuration used by the frontend to communicate with the Spring Boot backend.

It handles two main things:

1. Automatically attaching the JWT access token to every request.
2. Automatically refreshing the access token when it expires.

---

## 1. Imports

```ts
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import type { GlobalResponse, RefreshResponse } from "./types";
import { authApi } from "./auth.api";
```

### `axios`

Used to create and send HTTP requests.

### `AxiosError`

Provides TypeScript typing for Axios errors.

### `InternalAxiosRequestConfig`

Used to type the original request that failed.

### `GlobalResponse`

Represents the common response structure from the backend:

```ts
interface GlobalResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
```

### `RefreshResponse`

Represents the tokens returned from the refresh endpoint:

```ts
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

### `authApi`

Used when the user needs to be logged out because authentication can no longer be recovered.

---

# 2. Creating the Axios Instance

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Instead of using Axios directly everywhere, we create one shared Axios instance called `api`.

The base URL comes from the environment file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Therefore:

```ts
api.get("/tasks/my");
```

becomes:

```text
GET http://localhost:8080/api/tasks/my
```

This keeps API URLs centralized.

---

# 3. Request Interceptor

```ts
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
```

A **request interceptor** runs before every request sent through `api`.

It gets the access token from Local Storage:

```ts
const accessToken = localStorage.getItem("access_token");
```

If the token exists, it adds it to the request:

```http
Authorization: Bearer <access_token>
```

For example:

```text
GET /api/tasks/my
Authorization: Bearer eyJhbGciOi...
```

This means we don't have to manually add the token to every API request.

---

# 4. Response Interceptor

```ts
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
```

The response interceptor runs after the backend responds.

There are two possibilities:

### Successful response

```ts
(response) => response
```

The response is returned normally.

For example:

```text
200 OK
```

### Failed response

```ts
async (error: AxiosError) => {
```

The error is handled here.

We are mainly interested in:

```text
401 Unauthorized
```

because an expired access token should cause the backend to return `401`.

---

# 5. Getting the Original Request

```ts
const originalRequest = error.config as
  | (InternalAxiosRequestConfig & { _retry?: boolean })
  | undefined;
```

`error.config` contains the request that failed.

For example, the original request could be:

```text
GET /api/tasks/my
```

We save it because after getting a new access token, we need to send this request again.

The `_retry` property is added to keep track of whether the request has already been retried.

---

# 6. Ignore Requests That Should Not Be Refreshed

```ts
if (
  !originalRequest ||
  error.response?.status !== 401 ||
  originalRequest._retry
) {
  return Promise.reject(error);
}
```

The refresh process only happens when:

* The original request exists.
* The response status is `401`.
* The request has not already been retried.

For example:

```text
404 → normal error
403 → normal error
500 → normal error
401 → try to refresh
```

The `_retry` check prevents an infinite refresh loop.

---

# 7. Protect the Refresh Endpoint

```ts
if (originalRequest.url?.includes("/auth/refresh")) {
  authApi.logout();
  return Promise.reject(error);
}
```

We should never try to refresh the refresh request itself.

For example:

```text
Request
   ↓
401
   ↓
/auth/refresh
   ↓
401
```

If we tried to refresh again, it could create an infinite loop.

Therefore, if the refresh endpoint itself returns `401`, we log the user out.

---

# 8. Mark the Request as Retried

```ts
originalRequest._retry = true;
```

This marks the request as already retried.

If the new token also fails, Axios will not keep refreshing forever.

---

# 9. Get the Refresh Token

```ts
const refreshToken = localStorage.getItem("refresh_token");
```

The refresh token is stored in Local Storage.

If there is no refresh token:

```ts
if (!refreshToken) {
  authApi.logout();
  return Promise.reject(error);
}
```

There is no way to get a new access token, so the user must log in again.

---

# 10. Request a New Access Token

```ts
const { data } = await axios.post<GlobalResponse<RefreshResponse>>(
  `${api.defaults.baseURL}/auth/refresh`,
  { refreshToken }
);
```

The frontend sends the refresh token to:

```text
POST /api/auth/refresh
```

The request body is:

```json
{
  "refreshToken": "..."
}
```

Notice that we use:

```ts
axios.post(...)
```

instead of:

```ts
api.post(...)
```

This is intentional.

`api` has the response interceptor.

If we used `api` to refresh the token, the refresh request could trigger the same interceptor and potentially create a refresh loop.

Using the standard Axios instance avoids that problem.

---

# 11. Get the New Tokens

```ts
const { accessToken, refreshToken: newRefreshToken } = data.data;
```

The backend returns:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

The frontend extracts both tokens.

The refresh token is renamed to `newRefreshToken` to distinguish it from the old refresh token.

---

# 12. Save the New Tokens

```ts
localStorage.setItem("access_token", accessToken);
localStorage.setItem("refresh_token", newRefreshToken);
```

The new tokens replace the old tokens in Local Storage.

Now future requests will automatically use the new access token because of the request interceptor.

---

# 13. Update the Original Request

```ts
originalRequest.headers.Authorization = `Bearer ${accessToken}`;
```

The original request contained the expired access token.

We replace it with the new access token.

Before:

```http
Authorization: Bearer OLD_TOKEN
```

After:

```http
Authorization: Bearer NEW_TOKEN
```

---

# 14. Retry the Original Request

```ts
return api(originalRequest);
```

The request that originally failed is sent again using the new access token.

For example:

```text
GET /api/tasks/my
       ↓
401 Unauthorized
       ↓
POST /api/auth/refresh
       ↓
New access token
       ↓
GET /api/tasks/my
       ↓
200 OK
```

The user does not need to log in again.

---

# 15. If Refresh Fails

```ts
catch (refreshError) {
  authApi.logout();
  return Promise.reject(refreshError);
}
```

If the refresh token is expired, invalid, or rejected by the backend, the user can no longer be authenticated.

The user is logged out and must log in again.

---

# Complete Authentication Flow

```text
User makes API request
        ↓
Request interceptor
        ↓
Attach access token
        ↓
Backend
        ↓
   Is token valid?
      /      \
    YES       NO
     ↓         ↓
   200        401
               ↓
       Get refresh token
               ↓
       POST /auth/refresh
               ↓
       New access token
               ↓
       Save new tokens
               ↓
       Retry original request
               ↓
              200
```

## Summary

The Axios configuration provides automatic JWT handling:

* **Request interceptor** → attaches the access token.
* **Response interceptor** → detects `401 Unauthorized`.
* **Refresh token** → gets a new access token.
* **Retry** → repeats the failed request automatically.
* **Logout** → happens when the refresh process fails.

This allows the application to keep the user authenticated without requiring them to manually log in every time the short-lived access token expires.
