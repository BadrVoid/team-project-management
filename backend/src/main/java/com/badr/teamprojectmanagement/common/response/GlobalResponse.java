package com.badr.teamprojectmanagement.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalResponse<T> {

    //GlobalMessage Content
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    //GlobalMessage Content when success
    public static <T> GlobalResponse<T> success(String message, T data) {
        return GlobalResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    //GlobalMessage Content when no message
    public static <T> GlobalResponse<T> success(T data) {
        return success("Operation successful", data);
    }

    //GlobalMessage Content when error
    public static <T> GlobalResponse<T> error(String message) {
        return GlobalResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}