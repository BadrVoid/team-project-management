package com.badr.teamprojectmanagement.exception;

import com.badr.teamprojectmanagement.common.response.GlobalResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GlobalResponse<Void>> handleNotFound(
            ResourceNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(GlobalResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<GlobalResponse<Void>> handleBadRequest(
            BadRequestException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(GlobalResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<GlobalResponse<Void>> handleUnauthorized(
            UnauthorizedException exception) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(GlobalResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<GlobalResponse<Void>> handleForbidden(
            ForbiddenException exception) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(GlobalResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalResponse<Void>> handleGeneralException(
            Exception exception) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(GlobalResponse.error("Something went wrong"));
    }
}