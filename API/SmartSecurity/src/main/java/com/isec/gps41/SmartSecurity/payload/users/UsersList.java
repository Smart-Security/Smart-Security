package com.isec.gps41.SmartSecurity.payload.users;

import com.isec.gps41.SmartSecurity.payload.UserDto;
import lombok.Data;

import java.util.List;

@Data
public class UsersList {

    private boolean isLast;
    private int maxUsers;
    private int length;
    private List<UserDto> users;
}
