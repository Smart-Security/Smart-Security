package com.isec.gps41.SmartSecurity.constants;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class ROLES {

    public static SimpleGrantedAuthority USER = new SimpleGrantedAuthority("USER");
    public static SimpleGrantedAuthority SECURITY_GUARD = new SimpleGrantedAuthority("SECURITY_GUARD");

}
