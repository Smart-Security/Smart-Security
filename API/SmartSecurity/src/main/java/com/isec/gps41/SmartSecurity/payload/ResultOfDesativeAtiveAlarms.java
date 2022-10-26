package com.isec.gps41.SmartSecurity.payload;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultOfDesativeAtiveAlarms {
    private boolean result;
    List<DivisionDto> divisions;
}
