import { React,createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export  const LeadContext=createContext()

const LeadContextProvider=(props)=>{
    // const backendUrl='http://localhost:3000/api'
    const backendUrl='https://leadgeneration-1.onrender.com/api'

//set cookies 
const setCookie=(name,value)=>{
 document.cookie=`${name}=${value}; path=/`
}

//get cookies
  const getCookie = (name) => {
  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return value;
    }
  }

  return null;
};

  const navigate=useNavigate()

// delete cookies
 const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  };



    const value={
   
        backendUrl,
        setCookie,
        deleteCookie,
        getCookie,
        navigate
    }

return(
    <LeadContext.Provider value={value}>
        {props.children}
    </LeadContext.Provider>
)
}

export default LeadContextProvider;