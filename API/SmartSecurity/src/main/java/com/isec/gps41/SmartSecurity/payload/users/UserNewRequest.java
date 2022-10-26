package com.isec.gps41.SmartSecurity.payload.users;

import com.isec.gps41.SmartSecurity.payload.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserNewRequest {

    UserDto user;
    String password;
    List<UUID> divisions;

}
