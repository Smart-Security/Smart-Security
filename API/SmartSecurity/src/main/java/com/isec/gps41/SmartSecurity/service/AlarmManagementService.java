package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.Register;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.payload.log.RegisterDto;
import com.isec.gps41.SmartSecurity.payload.log.RegisterPageable;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

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
        Set<Division> divisions;
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getUserById(id);
        divisions = getDivisionsOfUser(listDivisionUUID, u);
        alarmService.desativateAlarmeIfIsNotAtivate(divisions, u);
        return divisions.stream().map(DivisionDto::mapToDto).toList();
    }

    public List<DivisionDto> activeAlarms(List<UUID> listDivisionUUID, String token) {
        Set<Division> divisions;
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getUserById(id);
        divisions = getDivisionsOfUser(listDivisionUUID, u);
        alarmService.activeAlarmsGuard(divisions, u);

        return divisions.stream().map(DivisionDto::mapToDto).toList();
    }

    private Set<Division> getDivisionsOfUser(List<UUID> listDivisionUUID, User u){
        Set<Division> divisions;

        if(u.getRole().equals(ROLES.USER_ROLE)) {
            divisions = divisionService.matchDivisions(listDivisionUUID, u.getDivisions());
        }else {
            divisions = divisionService.getDivisionsByUUID(listDivisionUUID);
        }
        divisions = divisionService.filterDivisions(divisions);
        return divisions;
    }

    public RegisterPageable getLogs(Integer pageNumber, Integer pageSize, String order, Date date, String field) {
        RegisterPageable registerPageable = new RegisterPageable();
        List<Register> registers = alarmService.getRegisters(pageNumber, pageSize, order, date, field);
        registerPageable.setRegisters(registers.stream().map(RegisterDto::mapToDto).toList());

        long max = alarmService.getMaxRegisters();
        registerPageable.setMaxRegisters(max);
        boolean isLast = ((long) pageSize * (pageNumber + 1)) + pageNumber >= max;
        registerPageable.setLastPage(isLast);
        registerPageable.setLength(registers.size());

        return registerPageable;
    }

    public void leave(String token) {
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getUserById(id);
        alarmService.leave(u);
    }

    public void goTo(String token, Optional<UUID> uuids) {
        UUID uuid = uuids.orElseThrow( () -> new ResourcesInvalid("UUID invalid", HttpStatus.BAD_REQUEST));
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getUserById(id);
        Division division = divisionService.getDivisionByUUID(uuid);
        Set<Division> divisions = divisionService.filterDivisions(Set.of(division));
        alarmService.goTo(u,divisions);
    }

    public List<DivisionDto> activeOrDeactive(List<UUID> uuids, String token) {
        Set<Division> divisions;
        long id = tokenProvider.getIdByToken(token);
        User u = userService.getUserById(id);
        divisions = getDivisionsOfUser(uuids, u);
        alarmService.activateOrDeactivate(divisions, u);
        return divisions.stream().map(DivisionDto::mapToDto).toList();
    }
}
