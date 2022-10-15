package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    UserRepository userRepository;

    @GetMapping()
    public ResponseEntity<String> testeAuth(@RequestHeader("Authorization") String token){

        String email = tokenProvider.getEmailByToken(token);
        User user = userRepository.findByEmail(email);

        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }
}
