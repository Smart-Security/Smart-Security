package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.payload.AuthResponseDto;
import com.isec.gps41.SmartSecurity.payload.LoginRequest;
import org.junit.Before;
import org.junit.Test;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
public class AuthControllerTest extends AbstractTest{

    @Override
    @Before
    public void setUp() {
        super.setUp();
    }


    @Test
    public void doLogin() throws Exception{
        String uri = "/auth/login";
        LoginRequest request = new LoginRequest("daniel@gmail.com", "asd123");
        String inputJson = super.mapToJson(request);

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(inputJson)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();
        AuthResponseDto authResponse = super.mapFromJson(content, AuthResponseDto.class);
        assertEquals("Bearer", authResponse.getTokenType());
        assertTrue(authResponse.getToken().length() > 1);

    }

}
