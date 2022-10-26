package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.TypeDivision;
import com.isec.gps41.SmartSecurity.payload.ResultOfDesativeAtiveAlarms;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import com.isec.gps41.SmartSecurity.repository.RegisterRepository;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Date;

import static org.junit.Assert.*;

public class UsersBOControllerTest extends AuthenticationSecurityGuardTest{


    @Autowired
    UserRepository userRepository;

    @Autowired
    DivisionRepository divisionRepository;

    @Autowired
    RegisterRepository registerRepository;

    @Autowired
    AlarmRepository alarmRepository;


    @Test
    public void createUser() throws Exception {
        String uri = "/api/bo/users/new";

        UserNewRequest userNewRequest = new UserNewRequest();
        UserDto userDto = new UserDto();
        userDto.setEmail("teste@gmail.com");
        userDto.setName("Teste");
        userDto.setBirthDate(new Date(1990, 01, 01));
        userNewRequest.setPassword("asd123");
        userNewRequest.setUser(userDto);
        userNewRequest.setDivisions(divisionRepository.findAll().stream().filter(d -> d.getType() == TypeDivision.OFFICE).map(Division::getUuid).toList());
        String inputJson = super.mapToJson(userNewRequest);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", token).content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(status, 201);
        UserDto result = super.mapFromJson(mvcResult.getResponse().getContentAsString(), UserDto.class);
        assertNotNull(result);
        assertTrue(result.getUuid().toString().length() > 1);
        assertEquals(ROLES.USER, result.getRole().toString());
    }


}
