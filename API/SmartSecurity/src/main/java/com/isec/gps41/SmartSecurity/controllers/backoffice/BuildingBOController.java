package com.isec.gps41.SmartSecurity.controllers.backoffice;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.payload.BuildingDetailsRequest;
import com.isec.gps41.SmartSecurity.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/bo/building")
public class BuildingBOController {

    @Autowired
    BuildingService buildingService;

    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @GetMapping()
    public ResponseEntity<BuildingDetailsRequest>index(){
        return new ResponseEntity<>(buildingService.getBuildingDetails(), HttpStatus.OK);
    }
}
