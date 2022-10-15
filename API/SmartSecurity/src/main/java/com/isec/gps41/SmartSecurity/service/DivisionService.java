package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.ResourcesInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.repository.DivisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DivisionService {


    @Autowired
    DivisionRepository divisionRepository;


    public Set<Division> getDivisionsByUUID(List<UUID> divisionsUUIDS) {
        if(divisionsUUIDS == null || divisionsUUIDS.size() == 0){
            throw new ResourcesInvalid("One or more divisions doesn't exists", HttpStatus.BAD_REQUEST);
        }
        Set<Division> divisions = divisionRepository.findAll().stream().filter(division -> divisionsUUIDS.contains(division.getUuid())).collect(Collectors.toSet());

        if(divisionsUUIDS.size() != divisions.size()){
            throw new ResourcesInvalid("One or more divisions doesn't exists", HttpStatus.BAD_REQUEST);
        }

        return divisions;
    }
}
