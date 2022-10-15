package com.isec.gps41.SmartSecurity.config;

import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import com.isec.gps41.SmartSecurity.service.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;

//@WebFilter(urlPatterns = {"/client/*"})
@Component
public class AuthorizationFilter extends OncePerRequestFilter {

//    @Value("${app.jwt.security.header}")
//    private String header;

    @Autowired
    UserDetails userDetails;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        String authHeader = request.getHeader("Authorization");
        if(!request.getRequestURI().equals("/auth/login") && !request.getRequestURI().equals("/auth/register")) {

            String token = authHeader.substring(7);
            if(tokenProvider.validateToken(token)){
                String email = tokenProvider.getEmailByToken(token);
                org.springframework.security.core.userdetails.UserDetails user = userDetails.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken uPAT = new UsernamePasswordAuthenticationToken(user, user.getPassword(), user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(uPAT);
                System.out.println(Instant.now());
            }
        }else{
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    "asd", null, new ArrayList<>()
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        chain.doFilter(request, response);
    }
}
