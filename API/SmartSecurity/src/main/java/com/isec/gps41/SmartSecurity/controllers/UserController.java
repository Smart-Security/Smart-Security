package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.payload.users.UsersList;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import com.isec.gps41.SmartSecurity.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private BuildingService buildingService;


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
    public ResponseEntity<UserNewRequest> newUser(@RequestHeader("Authorization") String auth, @RequestBody UserNewRequest userNewRequest){
        String token = auth.substring(7);
        buildingService.newUser(userNewRequest, token);

        return new ResponseEntity<>(userNewRequest, HttpStatus.CREATED);
    }

}
