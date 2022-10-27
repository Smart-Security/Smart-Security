package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DivisionRepository extends JpaRepository<Division, Long> {

    Optional<Division> findByUuid(UUID uuid);

    @Query(value = "SELECT * from divisions d WHERE d.uuid in ?1", nativeQuery = true)
    List<Division> findAllByUuidExists(List<UUID> ids);



}
