package com.isec.gps41.SmartSecurity.payload.division;


import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.TypeDivision;
import lombok.Data;


import java.util.UUID;
@Data
public class DivisionDto {


    private UUID uuid;

    private TypeDivision type;

    private String name;

    private boolean isOn;

    public static DivisionDto mapToDto(Division division) {
        DivisionDto dto = new DivisionDto();
        dto.setName(division.getName());
        dto.setType(division.getType());
        dto.setUuid(division.getUuid());
        dto.setOn(division.getAlarm().isOn());
        return dto;
    }
}
