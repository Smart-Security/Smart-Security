package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.Register;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
public class AlarmService {


    @Autowired
    AlarmRepository alarmRepository;

    @Autowired
    RegisterRepository registerRepository;

    public void desativateAlarmeIfIsNotAtivate(Set<Division> divisions, User user) {
        for (Division division : divisions) {
            if(division.getAlarm() == null){
                throw new ResourcesInvalid("Some division without alamr", HttpStatus.CONFLICT);
            }
            if(division.getAlarm().isOn()){
                division.getAlarm().setOn(false);
                alarmRepository.save(division.getAlarm());
            }
            createRegister(division, user);
        }

    }

    private void createRegister(Division division, User user) {
        Register register = new Register();
        register.setDivision(division);
        register.setUser(user);
        register.setEntry_at(new Date());
        registerRepository.save(register);
    }
}
