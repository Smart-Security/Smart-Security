import { createContext, useContext } from "react";
import useCookie from "./use-cookie.hook";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [userToken, setUserToken] = useCookie('token', null);
  
    /**
     * Call this function when you want to authenticate the user
     * @param {*} data 
     */
    const login = async (data) => {
      await setUserToken(JSON.stringify(data));
    };
  
    // call this function to sign out logged in user
    const logout = () => {
      setUserToken(null);
    };

    // call to check if the user is logged
    const isLogged = () => {
      const user = JSON.parse(userToken);
      return user !== null;
    }

    const user = JSON.parse(userToken);
    const value = {
      user,
      login,
      logout,
      isLogged
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };