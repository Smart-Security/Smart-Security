package com.isec.gps41.SmartSecurity.payload.log;

import lombok.Data;

import java.util.List;

@Data
public class RegisterPageable {

    private List<RegisterDto> registers;

    private int totalOfRegister;

    private boolean isLastPage;
}
