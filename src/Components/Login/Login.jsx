import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";

export const Login = () => {
  //Navigation between pages
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //Google sign-in logic
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "751440663044-mk7q436nd8bp2sa81iikjarme73r0385.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large" }
      );
    };
  }, []);

  //Google Sign-in handling
  const handleGoogleSignIn = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);

    const userData = parseJwt(response.credential);
    console.log("Google User Data: ", userData);

    localStorage.setItem("user", JSON.stringify(userData));
    setSuccess("Google Sign-In Successful! Redirecting...");
    setTimeout(() => {
      navigate("/MainPage");
    }, 2000);
  };

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  }

  //Facebook Sign-in (Not Working now need wait for verification)
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1383214732679544",
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
    };

    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Facebook Auth Response: ", response);

          // Get user data
          window.FB.api("/me", { fields: "name,email,picture" }, (userData) => {
            console.log("User Data:", userData);

            // Save user in local storage
            localStorage.setItem("user", JSON.stringify(userData));
            setSuccess("Facebook Login Successful! Redirecting...");

            setTimeout(() => {
              navigate("/MainPage");
            }, 2000);
          });
        } else {
          setError("Facebook login failed!");
        }
      },
      { scope: "email" }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //Web login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Login successful
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = () => {
    navigate("/Register");
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <div className="inputs">
          <div className="words">Email address</div>
          <div className="input">
            <User size={50} />
            <input
              type="email"
              name="email"
              placeholder="Type your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="words">Password</div>
          <div className="input">
            <KeyRound size={40} />
            <input
              type="password"
              name="password"
              placeholder="Type your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="submit-container">
            <div className="submit" onClick={handleLogin}>
              Login
            </div>
          </div>
          <div id="googleSignIn" className="outside-signin"></div>
          <div
            id="fb-login-button"
            className="outside-signin"
            onClick={handleFacebookLogin}
          ></div>
          <div className="sign-up" onClick={handleRegister}>
            Don't have an account? <span>Register</span>
          </div>
        </div>
      </div>
    </div>
  );
};
