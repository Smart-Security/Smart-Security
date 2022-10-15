package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Division;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DivisionRepository extends JpaRepository<Division, Long> {

    List<Division> findByUuid(UUID uuid);
}
