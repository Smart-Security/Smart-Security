package com.isec.gps41.SmartSecurity.exception;

import com.isec.gps41.SmartSecurity.payload.enums.ErrorEnum;
import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor

public class ResourcesInvalid extends ApiException{

    public ResourcesInvalid(String message, HttpStatus status) {
        super(message, status);
    }

    public ResourcesInvalid(String message, HttpStatus status, ErrorEnum errorCode) {
        super(message, status, errorCode);
    }
}
