package com.isec.gps41.SmartSecurity.exception;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourcesInvalid extends RuntimeException{

    private String message;
    private HttpStatus status;


}
