package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.FloorRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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


    public void desativateAlarms(List<UUID> listDivisionUUID, String token) {
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getDivisionsForUser(id);
        divisionService.matchDivisions(listDivisionUUID, u.getDivisions());
        alarmService.desativateAlarmeIfIsNotAtivate(u.getDivisions(), u);
    }
}
