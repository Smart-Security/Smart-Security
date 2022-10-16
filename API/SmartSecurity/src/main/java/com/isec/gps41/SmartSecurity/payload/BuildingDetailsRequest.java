package com.isec.gps41.SmartSecurity.payload;

import com.isec.gps41.SmartSecurity.model.Floor;
import com.isec.gps41.SmartSecurity.payload.floor.FloorDto;
import lombok.Data;

import java.util.List;

@Data
public class BuildingDetailsRequest {

    List<FloorDto> floorDtos;
}
