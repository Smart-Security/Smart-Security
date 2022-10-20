package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.repository.FloorRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AlarmManagementService {

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    DivisionService divisionService;

    @Autowired
    AlarmService alarmService;


    public List<DivisionDto> desativateAlarms(List<UUID> listDivisionUUID, String token) {
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getDivisionsForUser(id);
        divisionService.matchDivisions(listDivisionUUID, u.getDivisions());
        Set<Division> divisions = divisionService.filterDivisions(u.getDivisions());
        alarmService.desativateAlarmeIfIsNotAtivate(divisions, u);
        return divisions.stream().map(DivisionDto::mapToDto).toList();
    }

    public List<DivisionDto> activeAlarms(List<UUID> listDivisionUUID, String token) {
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getDivisionsForUser(id);
        divisionService.matchDivisions(listDivisionUUID, u.getDivisions());
        Set<Division> divisions = divisionService.filterDivisions(u.getDivisions());
        alarmService.activeAlarms(divisions, u);

        return divisions.stream().map(DivisionDto::mapToDto).toList();
    }
}
