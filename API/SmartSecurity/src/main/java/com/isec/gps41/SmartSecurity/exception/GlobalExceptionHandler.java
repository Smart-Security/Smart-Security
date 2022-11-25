package com.isec.gps41.SmartSecurity.exception;

import com.isec.gps41.SmartSecurity.payload.ErrorDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDetails> apiException(ApiException exception, WebRequest webRequest){
        ErrorDetails errorDetails = new ErrorDetails(new Date(), exception.getMessage());
        if (exception.getErrorCode() != null){
            errorDetails.setErrorCode(exception.getErrorCode());
        }
        return new ResponseEntity<>(errorDetails, exception.getStatus());
    }
}
