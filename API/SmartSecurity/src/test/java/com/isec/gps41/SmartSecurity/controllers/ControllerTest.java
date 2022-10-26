package com.isec.gps41.SmartSecurity.controllers;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ControllerTest extends AbstractTest{

    @Override
    @Before
    public void setUp() {
        super.setUp();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test", null, new ArrayList<>()));
    }

//    @Test
//    public void buildDb() throws Exception {
//        String uri = "/test/buildDB";
//
//        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                ).andReturn();
//
//        int status = mvcResult.getResponse().getStatus();
//        assertEquals(200, status);
//    }

}
