import React, { useEffect } from "react";
import "./styles.css";

import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";


const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFun() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigate('/')
          toast.success("Logged Successfully")
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message)
        });
    } catch (e) {
        toast.error(e.message)
    }
  }

  return (
    <div className="navbar">
      <h3>Financely.</h3>
      {user &&
      <div style={{display:'flex',gap:'5px'}}> <i className="fa-solid fa-user"></i> <p onClick={logoutFun}>Logout</p></div>}
    </div>
  );
};

export default Header;
