package com.isec.gps41.SmartSecurity.controllers.backoffice;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.payload.users.UserUpdateRequest;
import com.isec.gps41.SmartSecurity.payload.users.UsersList;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import com.isec.gps41.SmartSecurity.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bo/users")
public class UserBOController {

    @Autowired
    private BuildingService buildingService;

    @Autowired
    private AlarmManagementService alarmManagementService;


    //"hasRole({" + ROLES.SECURITY_GUARD + "})"
    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @GetMapping
    public ResponseEntity<UsersList> getUsers(@RequestHeader("Authorization") String token,
                                              @RequestParam(name = "pageNo", required = false)int numPage,
                                              @RequestParam(name = "pageSize", required = false) int size,
                                              @RequestParam(name="ord", required = false) String ord){
        UsersList response = buildingService.getUsers(numPage, size, ord);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @PostMapping("/new")
    public ResponseEntity<UserDto> newUser(@RequestHeader("Authorization") String auth, @RequestBody UserNewRequest userNewRequest){
        String token = auth.substring(7);
        UserDto u = buildingService.newUser(userNewRequest, token);

        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }



    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @PutMapping("/{uuid}")
    public ResponseEntity<UserDto> update(@RequestHeader("Authorization")String auth,
                                                    @PathVariable(name = "uuid")UUID uuid,
                                                    @RequestBody UserNewRequest userUpdateRequest){

        return new ResponseEntity<>(buildingService.updateUser(userUpdateRequest, uuid), HttpStatus.OK) ;
    }

    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @GetMapping("/{uuid}")
    public ResponseEntity<UserDto>show(@PathVariable(name = "uuid")UUID uuid){
        UserDto u = buildingService.getUserByUUID(uuid);
        return new ResponseEntity<>(u, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('" + ROLES.SECURITY_GUARD + "')")
    @DeleteMapping("/{uuid}")
    public ResponseEntity<String>destroy( @PathVariable(name = "uuid")UUID uuid){
        buildingService.inativeUser(uuid);
        return new ResponseEntity<>("", HttpStatus.OK);
    }



}
