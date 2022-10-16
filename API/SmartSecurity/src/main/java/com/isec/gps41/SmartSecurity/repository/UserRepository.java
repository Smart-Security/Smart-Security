package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    Optional<User> findById(long id);


    boolean existsByEmail(String email);

    List<User> findAllByRoleOrRole(GrantedAuthority role1, GrantedAuthority role2, Pageable pageable);

    List<User> findAllByRole(GrantedAuthority userRole, Pageable pageable);
    int countAllByRoleOrRole(GrantedAuthority role, GrantedAuthority role2);

    int countAllByRole(GrantedAuthority role1);

    Optional<User> findByUuid(UUID uuid);

}
