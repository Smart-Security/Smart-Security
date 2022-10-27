package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.LoginRequest;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;
    public User registerUser(LoginRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        user.setRole(ROLES.USER_ROLE);
        user.setBirthDate(new Date(1996, 03, 18));
        user.setName("aa");
        user.setActive(true);
        User u =  userService.create(user);

        return u;
    }
    public User login(LoginRequest request){
        Authentication authentication =  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail()
                ,request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return userService.findByEmail(request.getEmail(), true);
    }

}
