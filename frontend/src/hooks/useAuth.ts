import { useState, useCallback } from "react";
import { z } from 'zod';

import { httpSignup, httpLogin, httpLogout } from "./request.ts";
import { date } from "../utils/date.ts";

import { toast } from "sonner"
import { useAuthContext, AuthContextType } from "../context/AuthContext.tsx";

const loginSchema = z.object({
  usernamelogin: z.string().min(1, { message: "Username is required" }),
  passwordlogin: z.string().min(3, { message: "Password must be 3 or more characters long" }).max(12, { message: "Password must be 12 or fewer characters long" }),
})

const signupSchema = z.object({
  fullName: z.string().min(1, { message: "Full Name is required" }),
  gender: z.string().optional(),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(3, { message: "Password must be 3 or more characters long" }).max(12, { message: "Password must be 12 or fewer characters long" }),
  confirmPassword: z.string().min(3, { message: "Password must be 3 or more characters long" }).max(12, { message: "Password must be 12 or fewer characters long" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(data => data.gender == "male" || data.gender == "female", {
  message: "Select a Gender",
  path:["gender"],
})

function useAuth(){
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext() as AuthContextType;

    const submitSignup = useCallback(async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const fullName = data.get("name")?.toString();
        const gender = data.get("gender")?.toString();
        const username = data.get("username")?.toString();
        const password = data.get("password")?.toString();
        const confirmPassword = data.get("confirmPassword")?.toString();

        const zodResults = signupSchema.safeParse({
          fullName,
          gender,
          username,
          password,
          confirmPassword
        });
        if(!(zodResults.success)){
          const {dateString} = date();
          const errorString = [
            zodResults.error?.format().fullName?._errors.join(", "),
            zodResults.error?.format().gender?._errors.join(", "),
            zodResults.error?.format().username?._errors.join(", "),
            zodResults.error?.format().password?._errors.join(", "),
            zodResults.error?.format().confirmPassword?._errors.join(", "),
          ].filter(Boolean).join(", ");
          console.log(errorString);
          
          toast(errorString,{
            description: dateString,
          });
          setLoggedIn(false);
          return ;
        }

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            const {dateString} = date();
            toast("Failed Sign up : Missing field/s",{
              description: dateString,
            });
            setLoggedIn(false);
            return ;
        }
        else{
          if(password !== confirmPassword) {
            const {dateString} = date();
            toast("Failed Sign up : Passwords don't match",{
              description: dateString,
            });
            setLoggedIn(false);
            return ;
          }
        }
        
        const response = await httpSignup({
            fullName,
            gender,
            username,
            password,
            confirmPassword
        });
    
        const success = response.ok;
        // console.log(response);
        if (success) {
          if(response.error){
            const {dateString} = date();
            toast(`Failed Sign up : ${response.error}`,{
             description: dateString
            });
            setLoggedIn(false);
          }
          else{
            setTimeout(() => {
              localStorage.setItem("userData",JSON.stringify(response));
              setAuthUser(response);
              setLoggedIn(true);
              toast("Sign up successfull !!");
            }, 800);
          }
        } else {
          const {dateString} = date();
          toast(`Failed Sign up : ${response.error}`,{
            description: dateString
          });
          setLoggedIn(false);
        }
    }, [setAuthUser]);

    const submitLogin = useCallback(async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      const usernamelogin = data.get("usernamelogin")?.toString();
      const passwordlogin = data.get("passwordlogin")?.toString();

      const zodResults = loginSchema.safeParse({usernamelogin:usernamelogin, passwordlogin:passwordlogin});
      if(!(zodResults.success)){
        const {dateString} = date();
        if(zodResults.error?.format().passwordlogin){
          toast(zodResults.error?.format().passwordlogin?._errors.join(", "),{
            description: dateString,
          });
        }
        if(zodResults.error?.format().usernamelogin){
          toast(zodResults.error?.format().usernamelogin?._errors.join(", "),{
            description: dateString,
          });
        }
        setLoggedIn(false);
        return ;
      }

      const response = await httpLogin({
          username:usernamelogin,
          password:passwordlogin
      });
      
      const success = response.ok;
      if (success) {
        if(response.error){
          const {dateString} = date();
          toast(`Failed Login : ${response.error}`,{
           description: dateString
          });
          setLoggedIn(false);
        }
        else{
          setTimeout(() => {
            localStorage.setItem("userData",JSON.stringify(response));
            setAuthUser(response);
            setLoggedIn(true);
            toast("Login successfull !!");
          }, 800);
        }
      } else {
        const {dateString} = date();
        toast(`Failed Login : ${response.error}`,{
          description: dateString
        });
        setLoggedIn(false);
      }
    }, [setAuthUser]);

    const submitLogout = useCallback(async () => {
      
      const response = await httpLogout();

      const success = response.ok;
      if (success) {
        if(response.error){
          const {dateString} = date();
          toast(`Failed Login : ${response.error}`,{
           description: dateString
          });
        }
        else{
          localStorage.removeItem("userData");
          setAuthUser(undefined);
          setLoggedIn(false);
          toast("Logout successfull !!");
        }
      } else {
        const {dateString} = date();
        toast(`Failed Logout : ${response.error}`,{
          description: dateString
        });
      }
    }, [setAuthUser]);

    return {
        isLoggedIn,
        submitSignup,
        submitLogin,
        submitLogout
    }
}

export {
  useAuth
}