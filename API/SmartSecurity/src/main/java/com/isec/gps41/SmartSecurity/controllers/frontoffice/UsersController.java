package com.isec.gps41.SmartSecurity.controllers.frontoffice;

import com.isec.gps41.SmartSecurity.payload.ListUUID;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import com.isec.gps41.SmartSecurity.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fo/users")
public class UsersController {

    @Autowired
    BuildingService buildingService;

    @Autowired
    AlarmManagementService alarmManagementService;

    @GetMapping
    public ResponseEntity<UserDto>index(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.substring(7);

        return new ResponseEntity<>(buildingService.getUserDetails(token), HttpStatus.OK);
    }

    @GetMapping("/leave")
    public ResponseEntity<String> leave(@RequestHeader("Authorization") String authHeader){
        String token = authHeader.substring(7);
        alarmManagementService.leave(token);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PostMapping("/goto")
    public ResponseEntity<String> goTo(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody ListUUID listDivisionUUID){
        String token = authHeader.substring(7);
        alarmManagementService.goTo(token, listDivisionUUID.getUuids().stream().findFirst());
        return new ResponseEntity<>("", HttpStatus.OK);
    }

}
