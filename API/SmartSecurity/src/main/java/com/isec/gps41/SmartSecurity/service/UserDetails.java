package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetails implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    public UserDetails(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.isec.gps41.SmartSecurity.model.User user = userRepository.findByEmailAndActiveIsTrue(email);
        if(user == null){
            throw new UsernameNotFoundException("User not found");
        }
        return new User(user.getEmail(), user.getPassword(), List.of(user.getRole()));
    }
}
