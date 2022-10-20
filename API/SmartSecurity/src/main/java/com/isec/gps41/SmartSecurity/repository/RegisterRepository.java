package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Register;
import com.isec.gps41.SmartSecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface RegisterRepository extends JpaRepository<Register, Long> {

    List<Register> findAllByLeave_atIsNull();
}
