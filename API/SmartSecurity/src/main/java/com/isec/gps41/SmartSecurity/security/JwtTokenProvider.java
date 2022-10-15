package com.isec.gps41.SmartSecurity.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    private String JWT_SECRET = "JWTSecretKey";

    final private int jwtTimeout = 300000000;

    public String generateJwtToken(String email, Long id){

        Date currentDate = new Date();
        Date timeoutDate = new Date(currentDate.getTime() + jwtTimeout);

        return Jwts.builder()
                .setSubject(email)
                .setId(Long.toString(id))
                .setIssuedAt(new Date())
                .setExpiration(timeoutDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    public Long getIdByToken(String token){
        try {
            return Long.parseLong(Jwts.parser().setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody().getId());
        }catch (NumberFormatException e){
            return -1L;
        }
    }

    public String getEmailByToken(String token){

        return Jwts.parser().setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody().getSubject();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token);
        }catch (ExpiredJwtException e){
            return false;
        }
        return true;
    }


}
