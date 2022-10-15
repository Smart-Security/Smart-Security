package com.isec.gps41.SmartSecurity.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParamInvalid extends RuntimeException{
    private String message;
    private HttpStatus status;

}
