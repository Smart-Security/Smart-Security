package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
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
        List<Register> registers = registerRepository.getRegistersIfLeave_atIsNull().stream().toList();
        if(registers.stream().anyMatch(register -> register.getUser().getId() == user.getId())){
            throw new ResourcesInvalid("Já entrou nesta sala", HttpStatus.BAD_REQUEST);
        }
        
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
        if(user.getRole().equals(ROLES.SECURITY_GUARD_ROLE)){
            register.setLeave_at(new Date());
        }
        registerRepository.save(register);
    }

    public void activeAlarms(Set<Division> divisions, User u) {
        List<Register> registers = new java.util.ArrayList<>(registerRepository.getRegistersIfLeave_atIsNull().stream().toList());
        for (Division division : divisions) {
            List<Register> registersByDivision = registers.stream().filter(register -> register.getDivision().getId() == division.getId()).toList();
            if(!division.getAlarm().isOn() && registersByDivision.size() <= 1){
                division.getAlarm().setOn(true);
            }
            Register register = registers.stream().filter(reg -> reg.getDivision().getId() == division.getId()).findFirst()
                    .orElseThrow(() -> new ResourcesInvalid("Divisao nao foi ativada", HttpStatus.BAD_REQUEST));

            register.setLeave_at(new Date());
            registerRepository.save(register);
            alarmRepository.save(division.getAlarm());
            registers.remove(register);
        }
    }
}
