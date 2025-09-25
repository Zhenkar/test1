import React, { useState } from "react";
import logVideo from "../assets/log_regV.mp4";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import axios from "axios";

// Zod schema for registration form validation
const registerSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user", // Default to user
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // State for API errors

  const handleSubmit = async () => {
    try {
      // Validate input with Zod
      registerSchema.parse(formData);
      setErrors({});
      
      console.log("API call started ................")
      
      // Prepare data to send based on user type
      const data = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType, // Send userType with data
      };

      // Determine which API to call based on userType
      // const url = "http://localhost:3000/user/registe";
      const url = "/api/user/register"

      // Send form data to the backend
      const response = await axios.post(url, data);
  
      if (response.status === 201) {
        alert("Registration successful!");

        localStorage.setItem("username", formData.username);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("userType", formData.userType);
        // Clear form data after successful registration
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          userType: "user", // Reset to user by default
        });

        // Redirect user to profile page or another page
        navigate("/digA/profile");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display field validation errors
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      } else if (error.response) {
        // Handle server error response
        console.log("Server error:", error.response.data);
        setErrors({ form: error.response.data.message || "Registration failed. Please try again." });
      } else {
        // Generic error handling
        console.log("Error:", error);
        setErrors({ form: "An unexpected error occurred. Please try again later." });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <section className="h-screen w-screen flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-6/12 h-full flex flex-col justify-center items-center p-6 md:p-0">
          <h1 className="text-3xl font-extrabold absolute top-4 left-4">
            <span className="text-blue-400">Art</span>
            <span className="text-purple-700">G</span>
          </h1>

          <div className="w-full md:w-3/4 h-full md:h-full flex flex-col justify-center items-center shadow-2xl shadow-indigo-500/50 rounded-xl p-4">
            <p className="text-4xl md:text-6xl mb-8">Register</p>

            <div className="max-w-sm w-full mb-4">
              <label className="block text-sm font-medium mb-2">User Name</label>
              <input
                type="text"
                name="username"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${errors.username ? "border-red-500" : "border-blue-600"}`}
                placeholder="Enter User Name"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="max-w-sm w-full mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${errors.email ? "border-red-500" : "border-blue-600"}`}
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="max-w-sm w-full mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${errors.password ? "border-red-500" : "border-blue-600"}`}
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="max-w-sm w-full mb-4">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${errors.confirmPassword ? "border-red-500" : "border-blue-600"}`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* User Type Radio Buttons */}
            <div className="flex items-center mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={formData.userType === "user"}
                  onChange={handleChange}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="artist"
                  checked={formData.userType === "artist"}
                  onChange={handleChange}
                />
                Artist
              </label>
            </div>

            <button
              className="w-full lg:w-[25rem] py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="w-full md:w-6/12 h-full bg-gray-300 relative hidden md:block">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src={logVideo} type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};
