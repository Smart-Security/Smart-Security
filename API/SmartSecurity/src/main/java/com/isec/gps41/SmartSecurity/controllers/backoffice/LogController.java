package com.isec.gps41.SmartSecurity.controllers.backoffice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RequestMapping("/api/bo/log")
@RestController
public class LogController {


    @GetMapping()
    public ResponseEntity<String> index(@RequestParam(required = false, name = "date") Date date){



        return new ResponseEntity<>("", HttpStatus.OK);
    }

}
