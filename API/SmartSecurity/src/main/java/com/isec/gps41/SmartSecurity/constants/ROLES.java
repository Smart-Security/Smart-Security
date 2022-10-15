package com.isec.gps41.SmartSecurity.constants;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class ROLES {

    public static final String USER = "ROLE_USER";
    public static final String SECURITY_GUARD = "ROLE_SECURITY_GUARD";
    public final static SimpleGrantedAuthority USER_ROLE = new SimpleGrantedAuthority(USER);
    public final static  SimpleGrantedAuthority SECURITY_GUARD_ROLE = new SimpleGrantedAuthority(SECURITY_GUARD);

}
