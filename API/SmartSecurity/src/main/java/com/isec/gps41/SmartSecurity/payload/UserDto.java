package com.isec.gps41.SmartSecurity.payload;

import com.isec.gps41.SmartSecurity.model.Division;
import com.isec.gps41.SmartSecurity.model.User;
import com.isec.gps41.SmartSecurity.payload.division.DivisionDto;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;


import javax.management.relation.Role;
import java.util.List;
import java.util.UUID;
@Data
public class UserDto {


    private UUID uuid;

    private String email;



    private String name;

    private Integer age;

    private List<DivisionDto> divisionDtos;


    public static UserDto maptoDto(User user){
        UserDto userDto = new UserDto();
        userDto.age = user.getAge();
        userDto.email = user.getEmail();
        userDto.name = user.getName();
        userDto.uuid = user.getUuid();
        userDto.setDivisionDtos(user.getDivisions().stream().map(DivisionDto::mapToDto).toList());
        return  userDto;
    }
    public static User maptoUser(UserDto userdto){
        User user = new User();
        user.setAge(userdto.getAge());
        user.setEmail(userdto.getEmail());;
        user.setName(userdto.getName());
        user.setUuid(userdto.getUuid());
        return  user;
    }
}
