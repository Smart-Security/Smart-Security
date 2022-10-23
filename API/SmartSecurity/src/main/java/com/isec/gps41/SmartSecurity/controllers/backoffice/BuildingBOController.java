package com.isec.gps41.SmartSecurity.controllers.backoffice;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.payload.BuildingDetailsRequest;
import com.isec.gps41.SmartSecurity.payload.ListUUID;
import com.isec.gps41.SmartSecurity.payload.ResultOfDesativeAtiveAlarms;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import com.isec.gps41.SmartSecurity.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/bo/building")
public class BuildingBOController {

    @Autowired
    BuildingService buildingService;

    @Autowired
    AlarmManagementService alarmService;

    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @GetMapping()
    public ResponseEntity<BuildingDetailsRequest>index(){
        return new ResponseEntity<>(buildingService.getBuildingDetails(), HttpStatus.OK);
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


    @PostMapping("/activeOrDesative")
    public ResponseEntity<ResultOfDesativeAtiveAlarms> activeOrDeactive(@RequestHeader("Authorization") String authHeader,
                                                                    @RequestBody ListUUID listDivisionUUID){
        String token = authHeader.substring(7);

        //TODO: DO it
        List<DivisionDto> divisions = alarmService.activeOrDeactive(listDivisionUUID.getUuids(), token);
        ResultOfDesativeAtiveAlarms result = new ResultOfDesativeAtiveAlarms(true, divisions);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
