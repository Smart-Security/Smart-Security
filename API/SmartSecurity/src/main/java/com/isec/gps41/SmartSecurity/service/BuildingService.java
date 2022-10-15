package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.ParamInvalid;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.users.UsersList;
import com.isec.gps41.SmartSecurity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingService {

    @Autowired
    UserService userService;

    public UsersList getUsers(int numPage, int size, String ord) {
        validateOrder(ord);
        List<UserDto> dtos =  userService.getUsers(numPage, size, ord, true).stream().map(UserDto::maptoDto).toList();
        UsersList response = new UsersList();
        response.setLength(dtos.size());
        response.setUserDtos(dtos);
        int max = userService.getMaxUsers(true);
        response.setMaxUsers(max);
        boolean isLast = size*(numPage+1) + numPage >= max;
        response.setLast(isLast);
        return response;
    }

    private void validateOrder(String ord) {
        ord = ord.toLowerCase();
        if (ord.equals("asc") || ord.equals("desc")){
            return;
        }
        throw new ParamInvalid("Invalid order",HttpStatus.BAD_REQUEST);
    }


}
