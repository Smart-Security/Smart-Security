package com.isec.gps41.SmartSecurity.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

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

    private UUID uuid = UUID.randomUUID();

    private TypeDivision type;

    @ManyToMany
    @JoinTable(name="dependencies",
            joinColumns={@JoinColumn(name="id")},
            inverseJoinColumns={@JoinColumn(name="dependsof_id")})
    private List<Division> divisionsDependsOf;

    @OneToOne()
    private Alarm alarm;

    @ManyToOne
    private Floor floor;

}
