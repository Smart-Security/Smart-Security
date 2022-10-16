package com.isec.gps41.SmartSecurity.payload.users;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserUpdateRequest {

    UUID userUUID;
    List<UUID> divisionsUUIDS;
}
