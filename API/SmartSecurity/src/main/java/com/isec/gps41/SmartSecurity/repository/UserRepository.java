package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findById(long id);



}
