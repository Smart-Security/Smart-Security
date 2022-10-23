package com.isec.gps41.SmartSecurity.controllers.backoffice;

import com.isec.gps41.SmartSecurity.payload.log.RegisterPageable;
import com.isec.gps41.SmartSecurity.service.AlarmManagementService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    AlarmManagementService alarmManagementService;


    @GetMapping()
    public ResponseEntity<RegisterPageable> index(@RequestParam(required = false, name = "filter") Date date,
                                        @RequestParam(required = false, name = "ord") String order,
                                        @RequestParam(required = false, name = "pageNumber") Integer pageNumber,
                                        @RequestParam(required = false, name = "pageSize") Integer pageSize,
                                        @RequestParam(required = false, name = "field") String field){

        if(pageNumber == null || pageSize == null){
            pageNumber = 0;
            pageSize = 10;
        }
        if(order == null){
            order = "ASC";
        }else {
            order = order.toUpperCase();
        }
        if(field == null){
            field = "leaveAt";
        }

        RegisterPageable page = alarmManagementService.getLogs(pageNumber, pageSize, order, date, field);

        return new ResponseEntity<>(page, HttpStatus.OK);
    }

}
