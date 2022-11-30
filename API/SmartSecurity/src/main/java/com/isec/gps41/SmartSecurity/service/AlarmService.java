package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.exception.ParamInvalid;
import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.*;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
public class AlarmService {


    @Autowired
    AlarmRepository alarmRepository;

    @Autowired
    RegisterRepository registerRepository;

    public void desativateAlarmeIfIsNotAtivate(Set<Division> divisions, User user) {

        List<Register> registers = registerRepository.getRegistersIfLeave_atIsNull().stream().toList();
        StateOfAlarm state;
        if(registers.stream().anyMatch(register -> register.getUser().getId() == user.getId() && divisions.contains(register.getDivision()))){
            throw new ResourcesInvalid("Já entrou nesta sala", HttpStatus.BAD_REQUEST);
        }
        
        for (Division division : divisions) {
            if(division.getAlarm() == null){
                throw new ResourcesInvalid("Some division without alamr", HttpStatus.CONFLICT);
            }
            // Se o alarme estava desligado, ele desligou o
            if(division.getAlarm().isOn()){
                division.getAlarm().setOn(false);
                alarmRepository.save(division.getAlarm());
                state = StateOfAlarm.DEACTIVATE;
            }else {
                state = StateOfAlarm.KEEP_DEACTIVATE;
            }
            createRegister(division, user, state);
        }

    }

    private void createRegister(Division division, User user, StateOfAlarm stateOnEntry) {
        Register register = new Register();
        register.setDivision(division);
        register.setUser(user);
        register.setEntryAt(new Date());
        register.setStateOnEntry(stateOnEntry);
        registerRepository.save(register);
    }

    public void activeAlarms(Set<Division> divisions, User u) {
        StateOfAlarm state;

        //Biucar todos os registos com o leave a null
        List<Register> registers = new java.util.ArrayList<>(registerRepository.getRegistersIfLeave_atIsNull().stream().toList());
        for (Division division : divisions) {
            // Filtra os registos daquela divisao
            List<Register> registersByDivision = registers.stream().filter(register -> register.getDivision().getId() == division.getId()).toList();
            if(!division.getAlarm().isOn() && registersByDivision.size() <= 1){
                division.getAlarm().setOn(true);
            }
                //Obtem os registos do utilizador
            if(u.getRole().equals(ROLES.USER_ROLE)) {
                if(registersByDivision.size() <= 1){
                    state = StateOfAlarm.ACTIVATE;
                }else{
                    state = StateOfAlarm.KEEP_DEACTIVATE;
                }
                Register register = registersByDivision.stream().filter(reg -> reg.getUser().getId() == u.getId()).findFirst()
                        .orElseThrow(() -> new ResourcesInvalid("Divisao nao foi ativada", HttpStatus.BAD_REQUEST));

                register.setLeaveAt(new Date());
                register.setStateOnLeave(state);
                registerRepository.save(register);
                registers.remove(register);
            }else{
                AtomicBoolean haveRegisterOf = new AtomicBoolean(false);
                registersByDivision.forEach(register -> {
                    haveRegisterOf.set(register.getUser().getId() == u.getId());
                    register.setStateOnLeave(StateOfAlarm.ACTIVATE_BY_SECURITY_GUARD);
                    register.setLeaveAt(new Date());
                    registerRepository.save(register);
                });
                if (haveRegisterOf.get()){
                    Register r = new Register(); r.setUser(u); r.setDivision(division); r.setLeaveAt(new Date());
                    r.setEntryAt(new Date()); r.setStateOnEntry(StateOfAlarm.ACTIVATE_BY_SECURITY_GUARD);
                    r.setStateOnLeave(StateOfAlarm.ACTIVATE_BY_SECURITY_GUARD);
                }
            }
            alarmRepository.save(division.getAlarm());
        }
    }

    public List<Register> getRegisters(Integer pageNumber, Integer pageSize, String order, Date date, String filter) {
        Sort.Direction direction = order.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        List<Register> registers = null;
        Pageable pageable;
        Sort sort;

        filter = filterProperties(filter);
        sort = Sort.by(direction, filter);
        pageable = PageRequest.of(pageNumber, pageSize, sort);
        if (date != null){
            return registerRepository.findAllByLeaveAtIsBefore(date, pageable);
        }
        return registerRepository.findAll(pageable).toList();

    }

    private String filterProperties(String filter) {
        return switch (filter.toLowerCase()){
            case "leaveat" -> "leaveAt";
            case "entryat" -> "entryAt";
            default -> throw new ParamInvalid("filter wrong", HttpStatus.BAD_REQUEST);
        };
    }

    public void leave(User u) {
        List<Register> registers = registerRepository.findAllByLeaveAtIsNullAndUser_id(u.getId());
        Set<Division> divisions = registers.stream().map(Register::getDivision).collect(Collectors.toSet());
        activeAlarms(divisions, u);
    }

    public void goTo(User u, Set<Division> divisions) {
        Set<Division> turnOn = getDivisionsNeedTurnOn(u, divisions);
        activeAlarms(turnOn, u);
        desativateAlarmeIfIsNotAtivate(divisions, u);
    }

    private  Set<Division> getDivisionsNeedTurnOn(User u,  Set<Division> divisions) {
        List<Division> divisionsAlreadyDeactivate = registerRepository.findAllByLeaveAtIsNullAndUser_id(u.getId())
                .stream().map(Register::getDivision).toList();

        Set<Division> divisionsToActive = divisionsAlreadyDeactivate.stream().filter(d -> !divisions.contains(d)).collect(Collectors.toSet());
        divisionsToActive.forEach(d -> System.out.println(d.getName()));

        divisions.removeAll(divisionsAlreadyDeactivate);
        return divisionsToActive;
    }

    public void activateOrDeactivate(Set<Division> divisions, User u) {

        divisions = divisions.stream().sorted().collect(Collectors.toCollection(LinkedHashSet::new));

        for (Division division : divisions) {
            if(division.getAlarm().isOn()){
                desativateAlarmAdmin(division, u);
            }else {
                activeAlarmAdmin(division, u);
            }
        }
    }

    private void activeAlarmAdmin(Division division, User u) {
        StateOfAlarm state;
        Register register;
        boolean guardHaveRegister = false;
        //TOdos os registos da divisao que esta com leaveAt a null
        List<Register> registers = registerRepository.findAllByLeaveAtIsNullAndDivision_Id(division.getId());

        if (division.getType() == TypeDivision.COMMON_AREA){
            List<Division> divisionsAreDependent = division.getDivisionsAreDependentOfMe().stream()
                    .filter(d -> d.getType() != TypeDivision.COMMON_AREA).toList();
            for (Division division1 : divisionsAreDependent) {
                if(registerRepository.findAllByLeaveAtIsNullAndDivision_Id(division1.getId()).size() > 0){
                    return;
                }
            }
        }

        for (Register reg : registers) {

            //Guarda tem um registo?
            if(!guardHaveRegister){
                guardHaveRegister = reg.getUser().getId() == u.getId();
            }
            reg.setStateOnLeave(StateOfAlarm.ACTIVATE_BY_SECURITY_GUARD);
            reg.setLeaveAt(new Date());
            registerRepository.save(reg);
        }
        //Se o guarda nao tem um registo vamos entao criar
        if (!guardHaveRegister){
            register = new Register(); register.setEntryAt(new Date()); register.setLeaveAt(new Date());
            register.setUser(u); register.setDivision(division); register.setStateOnEntry(StateOfAlarm.ACTIVATE);
            register.setStateOnLeave(StateOfAlarm.ACTIVATE_BY_SECURITY_GUARD);
            registerRepository.save(register);
        }

        division.getAlarm().setOn(true);
        alarmRepository.save(division.getAlarm());
    }

    private void desativateAlarmAdmin(Division division, User u) {

        Register register = new Register();
        //TODO ver isto
        List<Register> registers = registerRepository.findAllByLeaveAtIsNullAndDivision_Id(division.getId());

        division.getAlarm().setOn(false);
        alarmRepository.save(division.getAlarm());

        register.setStateOnEntry(StateOfAlarm.DEACTIVATE);
        register.setUser(u); register.setDivision(division); register.setEntryAt(new Date());
        registerRepository.save(register);
    }

    /**
     * Get the number max of registers stored.
     * @return numer of registers
     */
    public long getMaxRegisters() {
        return registerRepository.count();
    }

    public void activeAlarmsGuard(Set<Division> divisions, User u) {
        divisions = divisions.stream().sorted().collect(Collectors.toCollection(LinkedHashSet::new));
        for (Division division : divisions) {
            activeAlarmAdmin(division, u);
        }

    }

    public void desativateAlarmsSecurityGuard(Set<Division> divisions, User u) {
        for (Division division : divisions) {
            if (division.getAlarm().isOn())
                desativateAlarmAdmin(division, u);
        }
    }
}










