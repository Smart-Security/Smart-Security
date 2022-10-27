package com.isec.gps41.SmartSecurity.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Type(type="org.hibernate.type.UUIDCharType")
    @Column(nullable = false, unique = true , updatable = false)
    private UUID uuid = UUID.randomUUID();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    GrantedAuthority role;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Date birthDate;

    @Size(min = 9 ,max = 15, message = "Phone size should be between 9 and 15")
    private String phone;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToMany
    Set<Division> divisions = new HashSet<>();


    @OneToMany(mappedBy = "user")
    Set<Register> registers = new HashSet<>();
}
