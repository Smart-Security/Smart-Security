package com.isec.gps41.SmartSecurity.payload;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;

}
