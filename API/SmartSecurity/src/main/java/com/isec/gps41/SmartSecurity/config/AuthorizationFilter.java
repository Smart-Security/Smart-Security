package com.isec.gps41.SmartSecurity.config;

import com.isec.gps41.SmartSecurity.exception.InvalidToken;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import com.isec.gps41.SmartSecurity.service.UserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
import java.util.List;

//@WebFilter(urlPatterns = {"/client/*"})
@Component
public class AuthorizationFilter extends OncePerRequestFilter {

//    @Value("${app.jwt.security.header}")
//    private String header;

    @Autowired
    UserDetails userDetails;

    @Autowired
    JwtTokenProvider tokenProvider;

    List<String> urlToPermit = new ArrayList<>(List.of("/auth/login", "/auth/register", "/test/buildDB"));

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        String authHeader = request.getHeader("Authorization");
        if(!urlToPermit.contains(request.getRequestURI())) {

            if(authHeader == null || authHeader.length() < 7){
                throw new InvalidToken("Invalid token", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);
            if(tokenProvider.validateToken(token)){
                org.springframework.security.core.userdetails.UserDetails user;
                try {
                    System.out.println("Dentro do try catch");
                    String email = tokenProvider.getEmailByToken(token);
                    user = userDetails.loadUserByUsername(email);
                }catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e){
                    throw new InvalidToken("Invalid token", HttpStatus.UNAUTHORIZED);
                }
                UsernamePasswordAuthenticationToken uPAT = new UsernamePasswordAuthenticationToken(user, user.getPassword(), user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(uPAT);
                System.out.println(Instant.now());
            }
        }else{
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    "permit", null, new ArrayList<>()
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        chain.doFilter(request, response);
    }
}
