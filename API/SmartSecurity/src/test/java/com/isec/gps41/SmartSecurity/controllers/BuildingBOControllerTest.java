package com.isec.gps41.SmartSecurity.controllers;


import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.TypeDivision;
import com.isec.gps41.SmartSecurity.payload.ListUUID;
import com.isec.gps41.SmartSecurity.payload.ResultOfDesativeAtiveAlarms;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import com.isec.gps41.SmartSecurity.repository.RegisterRepository;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class BuildingBOControllerTest extends AuthenticationSecurityGuardTest{


    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DivisionRepository divisionRepository;

    @Autowired
    RegisterRepository registerRepository;

    @Autowired
    AlarmRepository alarmRepository;


    @Test
    public void getUsers() throws Exception {
        String uri = "/api/bo/building";

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", token)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
    }

    @Test
    public void ativeOrDeative() throws Exception{
        String uri = "/api/bo/building/activeOrDesative";
        List<Division> divisions = divisionRepository.findAll();
        divisions = divisions.stream()
                .filter(division -> division.getAlarm().isOn() && division.getType() == TypeDivision.OFFICE).toList();

        boolean changeTest = false;

        if (divisions.size() == 0){
            divisions = divisionRepository.findAll();
            divisions = divisions.stream()
                    .filter(division -> !division.getAlarm().isOn() && division.getType() == TypeDivision.OFFICE).toList();
            changeTest = true;
        }

        ListUUID listDivisionUUID = new ListUUID();
        listDivisionUUID.setUuids(divisions.stream().map(Division::getUuid).collect(Collectors.toList()));

        String inputJson = super.mapToJson(listDivisionUUID);

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", token)
                .content(inputJson))
                .andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        ResultOfDesativeAtiveAlarms result = super.mapFromJson(mvcResult.getResponse().getContentAsString(), ResultOfDesativeAtiveAlarms.class);
        assertTrue(result.getDivisions().size() > 1);
        for (DivisionDto division : result.getDivisions()) {
            assertFalse(changeTest || division.isOn());
        }


        mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .header("Authorization", token)
                        .content(inputJson))
                .andReturn();

        status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        result = super.mapFromJson(mvcResult.getResponse().getContentAsString(), ResultOfDesativeAtiveAlarms.class);
        assertTrue(result.getDivisions().size() > 1);
        for (DivisionDto division : result.getDivisions()) {
            assertTrue(changeTest || division.isOn());
        }
    }


}
