import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, KeyRound } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase letter and special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={};':"|,.<>?])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!validateEmail(formData.email)) {
      setError("Bad boy/girl! Invalid email format :(");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Bad boy/girl! Password must be at least 8 characters long, contain at least 1 uppercase letter and 1 special character :("
      );
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Bad boy/girl! Passwords do not match :(");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <div className="text">Register</div>
        </div>
        {error && <div className="error-message">{error} 😢</div>}
        {success && <div className="success-message">{success} 🎉</div>}
        <div className="inputs">
          <div className="words">Username</div>
          <div className="input">
            <User size={50} />
            <input
              type="text"
              name="username"
              placeholder="Type your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="words">Email address</div>
          <div className="input">
            <Mail size={40} />
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
              placeholder="Type your password (min 8 chars, 1 uppercase, 1 special)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="words">Double Check</div>
          <div className="input">
            <KeyRound size={40} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Retype your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="submit-container">
            <div className="submit" onClick={handleRegister}>
              Register
            </div>
          </div>
          <div className="sign-up" onClick={handleLogin}>
            Already have account? <span>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};
