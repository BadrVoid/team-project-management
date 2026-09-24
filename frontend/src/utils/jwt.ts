import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  userId: string;
  role: string;
  exp: number;
  iat: number;
}

export function getUserIdFromToken(
  accessToken: string | null,
): string | null {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwtDecode<JwtPayload>(accessToken);

    return payload.userId;
  } catch {
    return null;
  }
}