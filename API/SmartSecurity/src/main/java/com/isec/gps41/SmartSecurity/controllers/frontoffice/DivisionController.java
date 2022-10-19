package com.isec.gps41.SmartSecurity.controllers.frontoffice;

import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.payload.ListUUID;
import com.isec.gps41.SmartSecurity.payload.ResultOfDesativeAtiveAlarms;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fo/division")
public class DivisionController {

    @Autowired
    AlarmManagementService alarmService;

    @GetMapping()
    public ResponseEntity<String> index(@RequestHeader("Authorization") String authHeader){


        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }


    @PostMapping()
    public ResponseEntity<ResultOfDesativeAtiveAlarms> desativeAlarm(@RequestHeader("Authorization") String authHeader,
                                                                     @RequestBody ListUUID listDivisionUUID){
        String token = authHeader.substring(7);
        if(listDivisionUUID.getUuids() == null){
            throw new ResourcesInvalid("List invalid", HttpStatus.BAD_REQUEST);
        }
        alarmService.desativateAlarms(listDivisionUUID.getUuids(), token);

        return new ResponseEntity<>(new ResultOfDesativeAtiveAlarms(true), HttpStatus.OK);
    }





}
