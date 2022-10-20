package com.isec.gps41.SmartSecurity.controllers.frontoffice;

import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.payload.ListUUID;
import com.isec.gps41.SmartSecurity.payload.ResultOfDesativeAtiveAlarms;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fo/division")
public class DivisionController {

    @Autowired
    AlarmManagementService alarmService;

    @GetMapping()
    public ResponseEntity<String> index(@RequestHeader("Authorization") String authHeader){


        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }


    @PostMapping("/desactiveAlarms")
    public ResponseEntity<ResultOfDesativeAtiveAlarms> desativeAlarm(@RequestHeader("Authorization") String authHeader,
                                                                     @RequestBody ListUUID listDivisionUUID){
        String token = authHeader.substring(7);
        if(listDivisionUUID.getUuids() == null){
            throw new ResourcesInvalid("List invalid", HttpStatus.BAD_REQUEST);
        }
        List<DivisionDto> divisions = alarmService.desativateAlarms(listDivisionUUID.getUuids(), token);
        ResultOfDesativeAtiveAlarms result = new ResultOfDesativeAtiveAlarms(true, divisions);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/activeAlarms")
    public ResponseEntity<ResultOfDesativeAtiveAlarms> activeAlarms(@RequestHeader("Authorization") String authHeader,
                                                             @RequestBody ListUUID listDivisionUUID){
        String token = authHeader.substring(7);

        List<DivisionDto> divisions = alarmService.activeAlarms(listDivisionUUID.getUuids(), token);
        ResultOfDesativeAtiveAlarms result = new ResultOfDesativeAtiveAlarms(true, divisions);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }



}
