package com.isec.gps41.SmartSecurity.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.AuthResponseDto;
import com.isec.gps41.SmartSecurity.payload.LoginRequest;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;

public class AuthenticationSecurityGuardTest extends AbstractTest{

    String token;
    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Override
    @Before
    public void setUp() {
        super.setUp();
    }

    @Before
    public void getAuthentication() throws Exception {
        List<User> users =  userRepository.findAll();

        User guard = users.stream().filter(user -> user.getRole().equals(ROLES.SECURITY_GUARD_ROLE)).findFirst()
                .orElseThrow(Exception::new);

        String t = tokenProvider.generateJwtToken(guard.getEmail(), guard.getId());

        token = "Bearear " + t;

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(guard.getEmail(), guard.getPassword(), List.of(guard.getRole())));
    }

}
