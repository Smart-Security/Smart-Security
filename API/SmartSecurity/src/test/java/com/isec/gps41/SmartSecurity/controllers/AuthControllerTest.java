package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;



@SpringBootTest
public class AuthControllerTest {


    @MockBean
    private UserRepository userRepository;
//
//    @Autowired
//    private MockMvc mockMvc;



    @Test
    @DisplayName("Should login")
    public void doLogin(){

    }
}
