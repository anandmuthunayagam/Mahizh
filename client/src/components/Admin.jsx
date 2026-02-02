import React from "react";
import CreateUser from "./createUser";
import OwnerResidentForm from "./OwnerResidentForm";

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

function Admin(){
    return(
        <>
        {isAdmin() && (
                    <>
                    <CreateUser />
                    </>
                     
                )}
        {isAdmin() && (
                    <>
                    <OwnerResidentForm />
                    </>
                     
                )}
                
        </>
    )

}
export default Admin