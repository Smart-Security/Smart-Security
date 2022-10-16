package com.isec.gps41.SmartSecurity.payload.users;

import com.isec.gps41.SmartSecurity.payload.UserDto;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserNewRequest {

    UserDto user;
    String password;
    List<UUID> divisions;

}
