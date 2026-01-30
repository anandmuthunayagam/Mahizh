import React from "react";
import CreateUser from "./createUser";

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
        </>
    )

}
export default Admin