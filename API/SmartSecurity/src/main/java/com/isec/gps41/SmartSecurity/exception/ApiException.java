package com.isec.gps41.SmartSecurity.exception;

import com.isec.gps41.SmartSecurity.payload.enums.ErrorEnum;
import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiException extends RuntimeException{
    private String message;
    private HttpStatus status;
    private ErrorEnum errorCode;

    public ApiException(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
