package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User create(User u){
        try {
            if (userRepository.existsByEmail(u.getEmail())) {
                throw new ResourcesInvalid("Email used", HttpStatus.BAD_REQUEST);
            }
            return userRepository.save(u);
        }catch (DataAccessException ex){
            throw new ResourcesInvalid( ex.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    public User save(User u){
        try {
            return userRepository.save(u);
        }catch (DataAccessException ex){
            throw new ResourcesInvalid( ex.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }


    public User findByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        }catch (Exception e){
            throw new ResourcesInvalid("Invalid information", HttpStatus.NOT_FOUND);
        }
    }

    public List<User> getUsers(int numPage, int size, String ord, boolean includGuard) {
        Sort sort = ord.equals("asc") ? Sort.by(Sort.Direction.ASC, "name") : Sort.by(Sort.Direction.DESC, "name") ;
        Pageable pageable = PageRequest.of(numPage, size, sort);
        if(includGuard){
            return userRepository.findAllByRoleOrRole(ROLES.SECURITY_GUARD_ROLE, ROLES.USER_ROLE, pageable);
        }else{
            return userRepository.findAllByRole(ROLES.USER_ROLE, pageable);
        }
    }

    public int getMaxUsers(boolean includGuard) {
        if (includGuard)
            return userRepository.countAllByRole(ROLES.USER_ROLE);
        return userRepository.countAllByRoleAndRole(ROLES.SECURITY_GUARD_ROLE, ROLES.USER_ROLE);
    }

    public void create(User user, Set<Division> divisions) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new ResourcesInvalid("Email used", HttpStatus.BAD_REQUEST);
            }
            user.setDivisions(divisions);
            userRepository.save(user);
        }catch (DataAccessException ex){
            throw new ResourcesInvalid( ex.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }
}
