package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class DivisionService {


    @Autowired
    DivisionRepository divisionRepository;


    public Set<Division> getDivisionsByUUID(List<UUID> divisionsUUIDS) {
        if(divisionsUUIDS == null || divisionsUUIDS.size() == 0){
            throw new ResourcesInvalid("One or more divisions doesn't exists", HttpStatus.BAD_REQUEST);
        }
        List<Division> divisions = divisionRepository.findAll();
        Set<Division> d =  new HashSet<>();//divisions.stream().filter(division -> divisionsUUIDS.contains(division.getUuid())).collect(Collectors.toSet());
        divisions.forEach( division -> {
            for (UUID divisionsUUID : divisionsUUIDS) {
                System.out.println(division.getUuid().toString() + " -> " + divisionsUUID.toString());
                if(divisionsUUID.equals(division.getUuid())){
                    d.add(division);
                    break;
                }
            }
        });

        if(divisionsUUIDS.size() != d.size()){
            throw new ResourcesInvalid("One or more divisions doesn't exists", HttpStatus.BAD_REQUEST);
        }

        return d;
    }


    public void matchDivisions(List<UUID> listDivisionUUID, Set<Division> divisions) {
        AtomicBoolean find = new AtomicBoolean(false);
        divisions.forEach( division -> {
            find.set(false);
            for (UUID divisionsUUID : listDivisionUUID) {
                System.out.println(division.getUuid().toString() + " -> " + divisionsUUID.toString());
                if(divisionsUUID.equals(division.getUuid())){
                    find.set(true);
                    break;
                }
            }
            if(!find.get()) {
                throw new ResourcesInvalid("UUID invalid", HttpStatus.BAD_REQUEST);
            }
        });
    }
}
