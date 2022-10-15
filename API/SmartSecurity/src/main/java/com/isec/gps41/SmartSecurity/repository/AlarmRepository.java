package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<Alarm,Long> {
}
