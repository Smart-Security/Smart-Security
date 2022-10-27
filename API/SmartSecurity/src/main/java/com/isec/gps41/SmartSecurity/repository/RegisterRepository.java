package com.isec.gps41.SmartSecurity.repository;

import com.isec.gps41.SmartSecurity.model.Register;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Date;
import java.util.List;

public interface RegisterRepository extends JpaRepository<Register, Long> {

    @Query("Select r from Register r where r.leaveAt is null")
    Collection<Register> getRegistersIfLeave_atIsNull();


    List<Register> findAllByLeaveAtIsNullAndUser_id(long idUser);

    List<Register> findAllByLeaveAtIsNullAndDivision_Id(long id);

    int countRegistersByLeaveAtIsNullAndDivision_Id(long divisionId);

    List<Register> findAllByLeaveAtIsBefore(Date date, Pageable pageable);

    long count();

    //@Query("Select r from Register r")
    //Collection<Register> getRegistersSortedByUserPageable(Pageable pageable);


}
