package com.isec.gps41.SmartSecurity.service;

import com.isec.gps41.SmartSecurity.exception.InvalidToken;
import com.isec.gps41.SmartSecurity.exception.ParamInvalid;
import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.Floor;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.BuildingDetailsRequest;
import com.isec.gps41.SmartSecurity.payload.UserDto;
import com.isec.gps41.SmartSecurity.payload.floor.FloorDto;
import com.isec.gps41.SmartSecurity.payload.users.UserNewRequest;
import com.isec.gps41.SmartSecurity.payload.users.UserUpdateRequest;
import com.isec.gps41.SmartSecurity.payload.users.UsersList;
import com.isec.gps41.SmartSecurity.repository.FloorRepository;
import com.isec.gps41.SmartSecurity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BuildingService {

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    DivisionService divisionService;

    @Autowired
    FloorRepository floorRepository;

    @Autowired
    AuthService authService;

    public UsersList getUsers(int numPage, int size, String ord) {
        validateOrder(ord);
        List<UserDto> dtos =  userService.getUsers(numPage, size, ord, true).stream().map(UserDto::maptoDto).toList();
        UsersList response = new UsersList();
        response.setLength(dtos.size());
        response.setUsers(dtos);
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
        Set<Division> divisions = divisionService.getDivisionsByUUID(userNewRequest.getDivisions());
        divisions = divisionService.filterDivisions(divisions);
        User u = UserDto.maptoUser(userNewRequest.getUser());
        u.setActive(true);
        u.setPassword(userNewRequest.getPassword());
        return UserDto.maptoDto(userService.create(u, divisions));

    }


    public UserDto updateUser(UserNewRequest userUpdateRequest, UUID uuid) {
        Set<Division> divisions = divisionService.getDivisionsByUUID(userUpdateRequest.getDivisions());
        User user = userService.findUserByUUID(uuid);

        userService.update(user, divisions, userUpdateRequest.getUser(), userUpdateRequest.getPassword());
        return UserDto.maptoDto(user);
    }



    private void validateToken(String auth){
        if(auth.length() < 7){
            throw new InvalidToken("Invalid token", HttpStatus.BAD_REQUEST);
        }
    }

    public BuildingDetailsRequest getBuildingDetails() {
        BuildingDetailsRequest response = new BuildingDetailsRequest();
        List<Floor> floors = floorRepository.findAll(Sort.by(Sort.Direction.ASC, "number"));
        List<FloorDto> dtos = floors.stream().map(FloorDto::mapToDto).toList();
        response.setFloorDtos(dtos);

        return response;
    }

    public void destroyUser(UUID uuid) {
        userService.destroyUser(uuid);
    }

    public UserDto getUserByUUID(UUID uuid) {
        User u  = userService.findUserByUUID(uuid);
        return UserDto.maptoDto(u);
    }

    public UserDto getUserDetails(String token) {
        long id = tokenProvider.getIdByToken(token);
        User user = userService.findUserById(id);
        return UserDto.maptoDto(user);
    }

    public void inativeUser(UUID uuid) {
        userService.inativeUser(uuid);
    }
}
