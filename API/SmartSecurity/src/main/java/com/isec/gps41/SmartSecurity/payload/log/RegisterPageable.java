package com.isec.gps41.SmartSecurity.payload.log;

import lombok.Data;

import java.util.List;

@Data
public class RegisterPageable {

    private List<RegisterDto> registers;
    private long maxRegisters;
    private boolean isLastPage;
    private int length;

}
