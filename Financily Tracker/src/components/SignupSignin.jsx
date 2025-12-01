import React, { useState } from "react";
import "./styles.css";
import Input from "./Input";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignupSignin = () => {

         const navigate = useNavigate(); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // SIGNUP with Email (form submit)
  async function signupWithEmail(e) {
    e.preventDefault();

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      pass.trim() === "" ||
      cpass.trim() === ""
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (pass !== cpass) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
     const user = userCredential.user;
     console.log("User>>",user)
     toast.success("User Account Created");
     await createDoc(user);
     navigate("/dashboard");


      // clear
      setName("");
      setEmail("");
      setPass("");
      setCpass("");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // LOGIN with Email (form submit) — await createDoc before navigate
async function loginWithEmail(e) {
  e.preventDefault();

  if (email.trim() === "" || pass.trim() === "") {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    console.log("Logged in user:", user);
    toast.success("Logged in successfully");

    // Ensure Firestore doc exists before navigating
    try {
      const res = await createDoc(user);
      if (res.created) {
        toast.success("User document created");
      } else {
        // optional: do nothing or show a subtle info toast
        // toast.info("User document already exists");
      }
    } catch (docError) {
      // If Firestore write fails, you might still want to allow login.
      console.error("createDoc failed:", docError);
      toast.error("Failed to create user document: " + docError.message);
      // Decide whether to navigate or not — here we still navigate:
    }

    // navigate after doc creation attempt
    navigate("/dashboard");

    // clear if you want
    setEmail("");
    setPass("");
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
}

  // Google signup/login (single function)
  async function signupWithGoogle(e) {
    if (e && e.preventDefault) e.preventDefault();

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
     const result = await signInWithPopup(auth, provider);
     const user = result.user;
     toast.success("Signed in with Google!");
     console.log("Google User>>" , user)
     await createDoc(user);
     navigate("/dashboard");

    } catch (error) {
      console.error("Google SignUp Error:", error);
      toast.error(error.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  }

// createDoc: only handles Firestore writes and errors (caller controls loading)
async function createDoc(user) {
  if (!user) throw new Error("No user provided to createDoc");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // build data using user info, fallback to local name state if needed
    const payload = {
      name: user.displayName ? user.displayName : name || "",
      email: user.email || "",
      photoURL: user.photoURL ? user.photoURL : "",
      createdAt: new Date(),
    };

    await setDoc(userRef, payload);
    return { created: true, payload };
  }

  // if doc exists, return sensible response (don't treat as error)
  return { created: false };
}

//google Auth
async function googleAuth(e) {
  if (e && e.preventDefault) e.preventDefault();

  // guard to prevent multiple popups
  if (loading) return;

  try {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider); // may throw
    const user = result.user;
    console.log("Google User >>", user);

    // ensure firestore doc exists (call your createDoc)
    try {
      await createDoc(user);
    } catch (docErr) {
      console.error("createDoc failed:", docErr);
      // not fatal — still allow login
    }

    toast.success("Signed in with Google");
    navigate("/dashboard");
  } catch (error) {
    console.error("Google auth error:", error);

    // Friendly messages for common popup errors
    if (error.code === "auth/cancelled-popup-request") {
      toast.info("Sign-in cancelled (multiple popups). Please try again.");
    } else if (error.code === "auth/popup-closed-by-user") {
      toast.info("Popup closed before completing sign-in.");
    } else if (error.code === "auth/popup-blocked") {
      toast.error("Popup blocked by browser. Allow popups or use another sign-in method.");
    } else {
      toast.error(error.message || "Google signup failed");
    }
  } finally {
    setLoading(false);
  }
}

  // Toggle helper that prevents accidental form submit
  function handleToggle(e) {
    // If this is triggered from inside a form element, prevent submit
    if (e && e.preventDefault) e.preventDefault();
    setLoginForm((prev) => !prev);
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login to <span style={{ color: "green" }}>Financely.</span>
          </h2>

          <form onSubmit={loginWithEmail}>
            <Input
              label="Email"
              type="email"
              state={email}
              setState={setEmail}
              placeholder="Enter Email"
            />

            <Input
              label="Password"
              type="password"
              state={pass}
              setState={setPass}
              placeholder="Enter Password"
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login using Email and Password"}
            </button>

            <p style={{ textAlign: "center" }}>or</p>

            <button
              className="btn-blue"
              type="button"
              onClick={googleAuth}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login using Google"}
            </button>

            <p style={{ textAlign: "center", marginTop: 12 }}>
              Or Don't Have An Account Already?{" "}
              <button
                type="button"
                onClick={handleToggle}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Click Me
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "green" }}>Financely.</span>
          </h2>

          <form onSubmit={signupWithEmail}>
            <Input
              label="Full Name"
              type="text"
              state={name}
              setState={setName}
              placeholder="Enter Name"
            />

            <Input
              label="Email"
              type="email"
              state={email}
              setState={setEmail}
              placeholder="Enter Email"
            />

            <Input
              label="Password"
              type="password"
              state={pass}
              setState={setPass}
              placeholder="Enter Password"
            />

            <Input
              label="Confirm Password"
              type="password"
              state={cpass}
              setState={setCpass}
              placeholder="Enter Confirm Password"
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "SignUp using Email and Password"}
            </button>

            <p style={{ textAlign: "center" }}>or</p>

            <button
              className="btn-blue"
              type="button"
              onClick={googleAuth}
              disabled={loading}
            >
              {loading ? "Signing in..." : "SignUp using Google"}
            </button>

            <p style={{ textAlign: "center", marginTop: 12 }}>
              Or Have An Account Already?{" "}
              <button
                type="button"
                onClick={handleToggle}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Click Me
              </button>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignin;
