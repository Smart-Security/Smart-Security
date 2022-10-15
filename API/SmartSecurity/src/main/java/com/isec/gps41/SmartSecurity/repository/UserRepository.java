package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findById(long id);


    boolean existsByEmail(String email);

    List<User> findAllByRoleOrRole(GrantedAuthority role1, GrantedAuthority role2, Pageable pageable);

    List<User> findAllByRole(GrantedAuthority userRole, Pageable pageable);

    int countAllByRoleAndRole(GrantedAuthority role1, GrantedAuthority role2);
    int countAllByRole(GrantedAuthority role1);
}
