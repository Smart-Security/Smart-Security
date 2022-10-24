package com.isec.gps41.SmartSecurity.payload;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import javax.management.relation.Role;
import java.util.Date;
import java.util.List;
import java.util.UUID;
@Data
public class UserDto {


    private UUID uuid;

    private String email;


    private String name;

    private Date birthDate;

    private List<DivisionDto> divisions;

    private String role;


    public static UserDto maptoDto(User user){
        UserDto userDto = new UserDto();
        userDto.birthDate = user.getBirthDate();
        userDto.email = user.getEmail();
        userDto.name = user.getName();
        userDto.uuid = user.getUuid();
        userDto.setDivisions(user.getDivisions().stream().map(DivisionDto::mapToDto).toList());
        userDto.setRole(user.getRole().toString());
        return  userDto;
    }
    public static User maptoUser(UserDto userdto){
        User user = new User();
        user.setBirthDate(userdto.getBirthDate());
        user.setEmail(userdto.getEmail());;
        user.setName(userdto.getName());
        user.setUuid(userdto.getUuid());
        user.setBirthDate(userdto.getBirthDate());
        return  user;
    }

    public static UserDto maptoDto2(User user){
        UserDto userDto = new UserDto();
        userDto.birthDate = user.getBirthDate();
        userDto.email = user.getEmail();
        userDto.name = user.getName();
        userDto.uuid = user.getUuid();
        //userDto.setDivisionDtos(user.getDivisions().stream().map(DivisionDto::mapToDto).toList());
        return  userDto;
    }

}
