package com.isec.gps41.SmartSecurity.payload;

import com.isec.gps41.SmartSecurity.model.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;


import javax.management.relation.Role;
import java.util.UUID;
@Data
public class UserDto {


    private UUID uuid;

    private String email;



    private String name;

    private Integer age;

    public static UserDto maptoDto(User user){
        UserDto userDto = new UserDto();
        userDto.age = user.getAge();
        userDto.email = user.getEmail();
        userDto.name = user.getName();
        userDto.uuid = user.getUuid();
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
