package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

        token = token.substring(7);
        String email = tokenProvider.getEmailByToken(token);
        //User user = userRepository.findByEmail(email);

        User user  = new User();
        user.setName("Daniel Fernandes");
        user.setEmail("daniel@gmail.com");
        user.setAge(26);
        user.setRole(ROLES.SECURITY_GUARD_ROLE);
        user.setPassword(new BCryptPasswordEncoder().encode("asd123"));


        userRepository.save(user);


        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }
}
