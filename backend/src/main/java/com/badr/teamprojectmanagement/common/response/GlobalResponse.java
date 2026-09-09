package com.badr.teamprojectmanagement.common.response;

import java.time.LocalDateTime;

public class GlobalResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public GlobalResponse() {
    }

    public GlobalResponse(boolean success, String message, T data, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public static <T> GlobalResponseBuilder<T> builder() {
        return new GlobalResponseBuilder<>();
    }

    public static <T> GlobalResponse<T> success(String message, T data) {
        return GlobalResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> GlobalResponse<T> success(T data) {
        return success("Operation successful", data);
    }

    public static <T> GlobalResponse<T> error(String message) {
        return GlobalResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public static class GlobalResponseBuilder<T> {
        private boolean success;
        private String message;
        private T data;
        private LocalDateTime timestamp;

        GlobalResponseBuilder() {
        }

        public GlobalResponseBuilder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public GlobalResponseBuilder<T> message(String message) {
            this.message = message;
            return this;
        }

        public GlobalResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        public GlobalResponseBuilder<T> timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public GlobalResponse<T> build() {
            return new GlobalResponse<>(success, message, data, timestamp);
        }
    }
}