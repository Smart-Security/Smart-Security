package com.isec.gps41.SmartSecurity.payload.floor;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.Floor;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class FloorDto {

    private int number;

    Set<DivisionDto> divisions = new HashSet<>();

    public static FloorDto mapToDto(Floor floor) {
        FloorDto floorDto = new FloorDto();
        floorDto.setNumber(floor.getNumber());
        floorDto.setDivisions(floor.getDivisions().stream().map(DivisionDto::mapToDto).collect(Collectors.toSet()));
        return floorDto;
    }
}
