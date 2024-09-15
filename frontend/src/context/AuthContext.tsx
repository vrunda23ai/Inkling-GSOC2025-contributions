import { createContext, useContext, useState, ReactNode } from "react";

export type authUser = {
  ok:boolean
  profilePic:string
  username:string
  fullName:string
  _id:string
}

export type AuthContextType = {
    authUser: authUser | undefined;
    setAuthUser: (newValue: authUser | undefined) => void;
}
type ContextProps = {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: ContextProps) {
    const userData = localStorage.getItem("userData");
    // console.log(userData);

    let parsedUserData: authUser | undefined = undefined;
    if (userData) {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (error) {
        parsedUserData = undefined;
      }
    }
    // console.log(parsedUserData);

    const [authUser, setAuthUser] = useState<authUser | undefined>(parsedUserData);

    return <AuthContext.Provider value={{ authUser, setAuthUser}}>
        {children}
    </AuthContext.Provider>
}

function useAuthContext (){
    return useContext(AuthContext);
}

export {
    AuthContext,
    AuthContextProvider,
    useAuthContext
}