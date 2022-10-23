package com.isec.gps41.SmartSecurity.payload.log;

import com.isec.gps41.SmartSecurity.model.Register;
import com.isec.gps41.SmartSecurity.model.StateOfAlarm;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class RegisterDto {


    private UUID uuid;

    private UserDto user;

    private DivisionDto division;

    Date entryAt;

    Date leaveAt;

    StateOfAlarm stateOnEntry;

    StateOfAlarm stateOnLeave;
    public static  RegisterDto mapToDto(Register register) {
        RegisterDto registerDto = new RegisterDto();
        registerDto.uuid = register.getUuid();
        registerDto.division = DivisionDto.mapToDto(register.getDivision());
        registerDto.user = UserDto.maptoDto2(register.getUser());
        registerDto.entryAt = register.getEntryAt();
        registerDto.leaveAt = register.getLeaveAt();
        registerDto.stateOnEntry = register.getStateOnEntry();
        registerDto.stateOnLeave = register.getStateOnLeave();
        return registerDto;
    }
}
