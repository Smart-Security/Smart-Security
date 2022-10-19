package com.isec.gps41.SmartSecurity.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "divisions")
public class Division {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Type(type="org.hibernate.type.UUIDCharType")
    @Column(nullable = false, unique = true , updatable = false)
    private UUID uuid = UUID.randomUUID();

    private TypeDivision type;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    @JoinTable(name="dependencies",
            joinColumns={@JoinColumn(name="id")},
            inverseJoinColumns={@JoinColumn(name="dependsof_id")})
    private List<Division> divisionsDependsOf = new ArrayList<>();

    @OneToOne()
    private Alarm alarm;

    @ManyToOne
    private Floor floor;

    @OneToMany(mappedBy = "division")
    Set<Register> registers = new HashSet<>();

}
