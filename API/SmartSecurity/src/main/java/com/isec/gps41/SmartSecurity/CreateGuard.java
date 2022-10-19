package com.isec.gps41.SmartSecurity;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.EntityManager;
import java.util.Date;

public class CreateGuard {

    @Autowired
    static UserRepository userRepository;

    public static void main(String[] args) {
        User user  = new User();
        user.setName("Daniel Fernandes");
        user.setBirthDate(new Date(1996, 03, 18));
        user.setRole(ROLES.SECURITY_GUARD_ROLE);
        user.setPassword(new BCryptPasswordEncoder().encode("asd123"));


        userRepository.save(user);

    }
}
