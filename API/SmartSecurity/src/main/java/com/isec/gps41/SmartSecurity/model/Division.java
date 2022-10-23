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
public class Division implements Comparable<Division>{

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

    @ManyToMany
    @JoinTable(name="dependencies",
            joinColumns={@JoinColumn(name="dependsof_id")},
            inverseJoinColumns={@JoinColumn(name="id")})
    private List<Division> divisionsAreDependentOfMe = new ArrayList<>();

    @OneToOne()
    private Alarm alarm;

    @ManyToOne
    private Floor floor;

    @OneToMany(mappedBy = "division")
    Set<Register> registers = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Division division = (Division) o;

        if (getId() != division.getId()) return false;
        return getUuid().equals(division.getUuid());
    }

    @Override
    public int hashCode() {
        int result = (int) (getId() ^ (getId() >>> 32));
        result = 31 * result + getUuid().hashCode();
        return result;
    }

    @Override
    public int compareTo(Division o) {
        if(type == o.getType()){
            return 0;
        } else if (type == TypeDivision.COMMON_AREA) {
            return 1;
        }
        else{
            return -1;
        }

    }
}
