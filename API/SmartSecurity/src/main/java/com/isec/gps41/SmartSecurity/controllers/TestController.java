package com.isec.gps41.SmartSecurity.controllers;

import com.isec.gps41.SmartSecurity.constants.ROLES;
import com.isec.gps41.SmartSecurity.model.*;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.repository.AlarmRepository;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import com.isec.gps41.SmartSecurity.repository.FloorRepository;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FloorRepository floorRepository;

    @Autowired
    DivisionRepository divisionRepository;

    @Autowired
    AlarmRepository alarmRepository;

    @GetMapping()
    public ResponseEntity<String> testeAuth(@RequestHeader("Authorization") String token){

        token = token.substring(7);
        String email = tokenProvider.getEmailByToken(token);
        //User user = userRepository.findByEmail(email);

        User user  = new User();
        user.setName("Daniel Fernandes");
        user.setEmail("daniel@gmail.com");
        user.setBirthDate(new Date(1996, 03, 18));
        user.setRole(ROLES.SECURITY_GUARD_ROLE);
        user.setPassword(new BCryptPasswordEncoder().encode("asd123"));


        userRepository.save(user);


        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }


    @GetMapping("/buildDB")
    public ResponseEntity<String> buildDB(){
        Floor floor = new Floor();
        floor.setNumber(0);

        Floor floor1 = new Floor();
        floor.setNumber(1);


        Division division = new Division();
        division.setFloor(floor);
        division.setType(TypeDivision.COMMON_AREA);
        division.setName("Entrada");

        Division division6 = new Division();
        division6.setFloor(floor1);
        division6.setType(TypeDivision.COMMON_AREA);
        division6.setName("Corredor");
        division6.getDivisionsDependsOf().add(division);

        Division division1 = new Division();
        division1.setFloor(floor1);
        division1.setType(TypeDivision.COMMON_AREA);
        division1.setName("LAS");
        division1.getDivisionsDependsOf().add(division);
        division1.getDivisionsDependsOf().add(division6);

        Division division2 = new Division();
        division2.setFloor(floor1);
        division2.setType(TypeDivision.OFFICE);
        division2.setName("LIS");
        division2.getDivisionsDependsOf().add(division);
        division2.getDivisionsDependsOf().add(division6);

        Division division3 = new Division();
        division3.setFloor(floor1);
        division3.setType(TypeDivision.COMMON_AREA);
        division3.setName("Casa de banho");
        division3.getDivisionsDependsOf().add(division);
        division3.getDivisionsDependsOf().add(division6);

        Division division4 = new Division();
        division4.setFloor(floor);
        division4.setType(TypeDivision.OFFICE);
        division4.setName("Anfiteatro");
        division4.getDivisionsDependsOf().add(division);


        Division division5 = new Division();
        division5.setFloor(floor);
        division5.setType(TypeDivision.OFFICE);
        division5.setName("Secretaria");
        division5.getDivisionsDependsOf().add(division);


        Alarm a = new Alarm();
        a.setOn(true);
        a.setName(division.getName() + " Alarm");

        Alarm a1 = new Alarm();
        a1.setOn(true);
        a1.setName(division1.getName() + " Alarm");

        Alarm a2 = new Alarm();
        a2.setOn(true);
        a2.setName(division2.getName() + " Alarm");

        Alarm a3 = new Alarm();
        a3.setOn(true);
        a3.setName(division3.getName() + " Alarm");

        Alarm a4 = new Alarm();
        a4.setOn(true);
        a4.setName(division4.getName() + " Alarm");

        Alarm a5 = new Alarm();
        a5.setOn(true);
        a5.setName(division5.getName() + " Alarm");

        Alarm a6 = new Alarm();
        a6.setOn(true);
        a6.setName(division6.getName() + " Alarm");


        alarmRepository.save(a);
        alarmRepository.save(a1);
        alarmRepository.save(a2);
        alarmRepository.save(a3);
        alarmRepository.save(a4);
        alarmRepository.save(a5);
        alarmRepository.save(a6);


        division.setAlarm(a);
        division1.setAlarm(a1);
        division2.setAlarm(a2);
        division3.setAlarm(a3);
        division4.setAlarm(a4);
        division5.setAlarm(a5);
        division6.setAlarm(a6);

        floorRepository.save(floor);
        floorRepository.save(floor1);

        division = divisionRepository.save(division);
        division6 = divisionRepository.save(division6);
        division1 = divisionRepository.save(division1);
        division2 = divisionRepository.save(division2);
        division3 = divisionRepository.save(division3);
        division4 = divisionRepository.save(division4);
        division5 = divisionRepository.save(division5);

        User user;
        user = createUser("Daniel", "daniel@gmail.com", new Date(1996, 03, 18),
                ROLES.SECURITY_GUARD_ROLE, "asd123");
        userRepository.save(user);
        user = createUser("Henrique", "henrique@gmail.com", new Date(1998, 11, 07),
                ROLES.USER_ROLE, "asd123");
        user.setDivisions(Set.of(division, division1, division2, division6));
        userRepository.save(user);

        user = createUser("Hugo Jorge", "hugo@gmail.com", new Date(1985, 03, 20),
                ROLES.USER_ROLE, "asd123");
        user.setDivisions(Set.of(division, division1, division2, division6));
        userRepository.save(user);


        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }


    private User createUser(String name, String email, Date birthDate, GrantedAuthority role, String password){
        User user  = new User();
        user.setName(name);
        user.setEmail(email);
        user.setBirthDate(birthDate);
        user.setRole(role);
        user.setPassword(new BCryptPasswordEncoder().encode(password));

        return user;
    }
    //only for test
    @GetMapping("/division")
    public ResponseEntity<String> addDivision(@RequestHeader("Authorization") String token){

        Floor floor = new Floor();
        floor.setNumber(0);

        Floor floor1 = new Floor();
        floor.setNumber(1);


        Division division = new Division();
        division.setFloor(floor);
        division.setType(TypeDivision.COMMON_AREA);
        division.setName("Entrada");

        Division division6 = new Division();
        division6.setFloor(floor1);
        division6.setType(TypeDivision.COMMON_AREA);
        division6.setName("Corredor");
        division6.getDivisionsDependsOf().add(division);

        Division division1 = new Division();
        division1.setFloor(floor1);
        division1.setType(TypeDivision.COMMON_AREA);
        division1.setName("LAS");
        division1.getDivisionsDependsOf().add(division);
        division1.getDivisionsDependsOf().add(division6);

        Division division2 = new Division();
        division2.setFloor(floor1);
        division2.setType(TypeDivision.OFFICE);
        division2.setName("LIS");
        division2.getDivisionsDependsOf().add(division);
        division2.getDivisionsDependsOf().add(division6);

        Division division3 = new Division();
        division3.setFloor(floor1);
        division3.setType(TypeDivision.COMMON_AREA);
        division3.setName("Casa de banho");
        division3.getDivisionsDependsOf().add(division);
        division3.getDivisionsDependsOf().add(division6);

        Division division4 = new Division();
        division4.setFloor(floor);
        division4.setType(TypeDivision.OFFICE);
        division4.setName("Anfiteatro");
        division4.getDivisionsDependsOf().add(division);


        Division division5 = new Division();
        division5.setFloor(floor);
        division5.setType(TypeDivision.OFFICE);
        division5.setName("Secretaria");
        division5.getDivisionsDependsOf().add(division);


        Alarm a = new Alarm();
        a.setOn(true);
        a.setName(division.getName() + " Alarm");

        Alarm a1 = new Alarm();
        a1.setOn(true);
        a1.setName(division1.getName() + " Alarm");

        Alarm a2 = new Alarm();
        a2.setOn(true);
        a2.setName(division2.getName() + " Alarm");

        Alarm a3 = new Alarm();
        a3.setOn(true);
        a3.setName(division3.getName() + " Alarm");

        Alarm a4 = new Alarm();
        a4.setOn(true);
        a4.setName(division4.getName() + " Alarm");

        Alarm a5 = new Alarm();
        a5.setOn(true);
        a5.setName(division5.getName() + " Alarm");

        Alarm a6 = new Alarm();
        a6.setOn(true);
        a6.setName(division6.getName() + " Alarm");


        alarmRepository.save(a);
        alarmRepository.save(a1);
        alarmRepository.save(a2);
        alarmRepository.save(a3);
        alarmRepository.save(a4);
        alarmRepository.save(a5);
        alarmRepository.save(a6);


        division.setAlarm(a);
        division1.setAlarm(a1);
        division2.setAlarm(a2);
        division3.setAlarm(a3);
        division4.setAlarm(a4);
        division5.setAlarm(a5);
        division6.setAlarm(a6);

        floorRepository.save(floor);
        floorRepository.save(floor1);

        divisionRepository.save(division);
        divisionRepository.save(division6);
        divisionRepository.save(division1);
        divisionRepository.save(division2);
        divisionRepository.save(division3);
        divisionRepository.save(division4);
        divisionRepository.save(division5);



        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }





    //Only for testes
    @GetMapping("/floor")
    public ResponseEntity<String> addFloor(@RequestHeader("Authorization") String token){


        List<Division> divisionList= divisionRepository.findAll();
        divisionList.size();

        List<Floor> floor = floorRepository.findAll();
        floor.forEach(System.out::println);

        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }

    @GetMapping("/new")
    public ResponseEntity<UserNewRequest> test(@RequestHeader("Authorization") String token){


        UserNewRequest userNewRequest = new UserNewRequest();
        UserDto u = UserDto.maptoDto(userRepository.findAll().stream().findFirst().get());
        userNewRequest.setUser(u);
        userNewRequest.setDivisions(u.getDivisions().stream().map(DivisionDto::getUuid).toList());
        userNewRequest.setDivisions(new ArrayList<>(Collections.singleton(UUID.randomUUID())));
        return new ResponseEntity<>(userNewRequest, HttpStatus.OK);
    }
}
