import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useCookie from "./use-coockie.hook";
import { ROLETYPE } from "./../models/user.model";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [userToken, setUserToken] = useCookie('token', null);
    const navigate = useNavigate(); // hoock to navigate programacticly
  
    /**
     * Call this function when you want to authenticate the user
     * @param {*} data 
     */
    const login = async (data) => {
      setUserToken(data);
    
      // if the user authenticated successfully
      //  change the current page according to your role
      switch (data.role) {
        case ROLETYPE.ADMIN:
          navigate("/administration")
          break;
        case ROLETYPE.EMPLOYEE:
          navigate("/goto")
          break;
        default:
          navigate("/")
          break;
      }
    };
  
    // call this function to sign out logged in user
    const logout = () => {
      setUserToken(null);
      navigate("/", { replace: true });
    };
  
    const value = {
      userToken,
      login,
      logout
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };