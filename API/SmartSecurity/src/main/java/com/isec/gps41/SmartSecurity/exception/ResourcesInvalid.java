package com.isec.gps41.SmartSecurity.exception;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor

public class ResourcesInvalid extends ApiException{

    public ResourcesInvalid(String message, HttpStatus status) {
        super(message, status);
    }
}
