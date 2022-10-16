package com.isec.gps41.SmartSecurity.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alarms")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id ;

    @Type(type="org.hibernate.type.UUIDCharType")
    @Column(nullable = false, unique = true, updatable = false)
    UUID uuid = UUID.randomUUID();

    @Column(nullable = false)
    String name;

    @Column(nullable = false)
    boolean isOn;

    @OneToOne
    @JoinColumn(name = "division_id")
    private Division division;
}
