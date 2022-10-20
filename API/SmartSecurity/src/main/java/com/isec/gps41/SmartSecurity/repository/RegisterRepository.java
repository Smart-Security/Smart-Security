package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Register;
import com.isec.gps41.SmartSecurity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Date;
import java.util.List;

public interface RegisterRepository extends JpaRepository<Register, Long> {

    @Query("Select r from Register r where r.leave_at is null")
    Collection<Register> getRegistersIfLeave_atIsNull();
}
