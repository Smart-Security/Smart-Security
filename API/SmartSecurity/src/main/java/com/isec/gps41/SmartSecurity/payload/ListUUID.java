package com.isec.gps41.SmartSecurity.payload;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ListUUID {

    List<UUID> uuids;
}
