package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.exception.InvalidToken;
import com.isec.gps41.SmartSecurity.exception.ParamInvalid;
import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.enums.ErrorEnum;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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


    public User findByEmail(String email, boolean active) {
        try {
            return userRepository.findByEmailAndActive(email, active);
        }catch (Exception e){
            throw new ResourcesInvalid("Invalid information", HttpStatus.NOT_FOUND);
        }
    }

    public List<User> getUsers(int numPage, int size, String ord, boolean includGuard) {
        Sort sort = ord.equals("asc") ? Sort.by(Sort.Direction.ASC, "name") : Sort.by(Sort.Direction.DESC, "name") ;
        Pageable pageable = PageRequest.of(numPage, size, sort);
        if(includGuard){
            return userRepository.findAllByRoleOrRoleAndActive(ROLES.SECURITY_GUARD_ROLE, ROLES.USER_ROLE, true ,pageable);
        }else{
            return userRepository.findAllByRoleAndActive(ROLES.USER_ROLE, true,pageable);
        }
    }

    public int getMaxUsers(boolean includGuard) {
        if (includGuard)
            return userRepository.countAllByRoleOrRoleAndActiveIsTrue(ROLES.SECURITY_GUARD_ROLE, ROLES.USER_ROLE);
        return userRepository.countAllByRoleAndActiveIsTrue(ROLES.USER_ROLE);
    }

    public User create(User user, Set<Division> divisions) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new ResourcesInvalid("Email used", HttpStatus.UNPROCESSABLE_ENTITY, ErrorEnum.EMAIL_USED);
            }
            checkPasswordRegex(user.getPassword());
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            user.setRole(ROLES.USER_ROLE);
            user.setDivisions(divisions);
            user.setUuid(UUID.randomUUID());
            user = userRepository.save(user);
        }catch (DataAccessException ex){
            throw new ResourcesInvalid( ex.getMessage() , HttpStatus.BAD_REQUEST);
        }
        return user;
    }


    public void update(User user, Set<Division> divisions, UserDto userDto, String password) {
        if(!userDto.getEmail().equals(user.getEmail())){
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new ResourcesInvalid("Email used", HttpStatus.UNPROCESSABLE_ENTITY, ErrorEnum.EMAIL_USED);
            }
            user.setEmail(userDto.getEmail());
        }
        if (password != null && !password.isEmpty()) {
            checkPasswordRegex(password);
            user.setPassword(AuthService.encodePassword(password));
        }
        user.setName(userDto.getName());
        user.setBirthDate(userDto.getBirthDate());
        user.setDivisions(divisions);
        userRepository.save(user);
    }

    private void checkPasswordRegex(String password) {
        String regex = "^(?=.\\d)(?=.[!@#$%^&])(?=.[a-z])(?=.*[A-Z]).{6,15}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);

        if(!matcher.matches()){
            throw new ResourcesInvalid("Password invalid format", HttpStatus.BAD_REQUEST, ErrorEnum.PASSWORD_NOT_VALID);
        }
    }

    public User findUserByUUID(UUID userUUID) {
        User u = userRepository.findByUuid(userUUID).orElseThrow( () -> new ParamInvalid("UUID invalid", HttpStatus.BAD_REQUEST));
        return u;
    }

    public void destroyUser(UUID uuid) {
        User user = findUserByUUID(uuid);
        userRepository.delete(user);
    }

    public User findUserById(long id) {
        return userRepository.findById(id).orElseThrow(() -> new InvalidToken("Token invalid, Please login again", HttpStatus.UNAUTHORIZED));
    }

    public User getUserById(long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new InvalidToken("Invalid token, please login again", HttpStatus.CONFLICT));
        return u;
    }

    public void inativeUser(UUID uuid) {
        User u = userRepository.findByUuid(uuid).orElseThrow(() -> new ResourcesInvalid("UUID invalid of user", HttpStatus.BAD_REQUEST));
        u.setActive(false);
        userRepository.save(u);
    }
}
