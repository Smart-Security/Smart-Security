package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.AuthResponseDto;
import com.isec.gps41.SmartSecurity.payload.LoginRequest;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import com.isec.gps41.SmartSecurity.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider tokenProvider;


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequest loginRequest){
        User user = authService.login(loginRequest);
        if(user != null) {
            String token = tokenProvider.generateJwtToken(loginRequest.getEmail(), user.getId());
            AuthResponseDto response = new AuthResponseDto();
            response.setRole(user.getRole().toString());
            response.setToken(token);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>( new AuthResponseDto(), HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody LoginRequest request){
        String regex = "^(.+)@(.+)$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(request.getEmail());
        //If email dont match with regex, throw ApiException
        if(!matcher.matches()){
            new ResponseEntity<>("Email invalid", HttpStatus.BAD_REQUEST);
        }

        //Register user to DataBase
        User user = authService.registerUser(request);

        //Generate  JwtToken
        String token = tokenProvider.generateJwtToken(request.getEmail(), user.getId());
        //Create Response with token
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
