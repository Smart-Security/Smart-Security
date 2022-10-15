package com.isec.gps41.SmartSecurity.exception;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor

public class InvalidToken extends ApiException{

    public InvalidToken(String message, HttpStatus status) {
        super(message, status);
    }
}
