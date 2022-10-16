package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.InvalidToken;
import com.isec.gps41.SmartSecurity.exception.ParamInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.payload.users.UserUpdateRequest;
import com.isec.gps41.SmartSecurity.payload.users.UsersList;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class BuildingService {

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    DivisionService divisionService;

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


    public UserDto newUser(UserNewRequest userNewRequest, String token) {
        long id = tokenProvider.getIdByToken(token);
        Set<Division> divisions = divisionService.getDivisionsByUUID(userNewRequest.getDivisionsUUIDS());

        userService.create(UserDto.maptoUser(userNewRequest.getUserDto()), divisions);
        return userNewRequest.getUserDto();
    }


    public UserUpdateRequest updateUser(UserUpdateRequest userUpdateRequest, UUID uuid) {
        Set<Division> divisions = divisionService.getDivisionsByUUID(userUpdateRequest.getDivisionsUUIDS());
        User user = userService.findUserByUUID(uuid);
        userService.update(user, divisions);
        return userUpdateRequest;
    }



    private void validateToken(String auth){
        if(auth.length() < 7){
            throw new InvalidToken("Invalid token", HttpStatus.BAD_REQUEST);
        }
    }
}
