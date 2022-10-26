package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import com.isec.gps41.SmartSecurity.repository.RegisterRepository;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

public class AuthenticationUserTest extends AbstractTest{

    String token;
    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    DivisionRepository divisionRepository;

    @Autowired
    RegisterRepository registerRepository;

    @Autowired
    AlarmRepository alarmRepository;

    User u;
    @Override
    @Before
    public void setUp() {
        super.setUp();
    }

    @Before
    public void getAuthentication() throws Exception {
        List<User> users =  userRepository.findAll();

        u = users.stream().filter(user -> user.getRole().equals(ROLES.USER_ROLE)).findFirst()
                .orElseThrow(Exception::new);

        String t = tokenProvider.generateJwtToken(u.getEmail(), u.getId());

        token = "Bearear " + t;

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(u.getEmail(), u.getPassword(), List.of(u.getRole())));
    }


}
