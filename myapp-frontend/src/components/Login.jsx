import React, { useState } from "react";
import logVideo from "../assets/log_regV.mp4";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Zod schema for login form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const Login = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Handle form submission and API call
  const handleSubmit = async () => {
    try {
      // Validate form data using Zod
      loginSchema.parse(formData);
      setErrors({}); // Clear errors

      // Make the API call
      const response = await fetch("/localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Login successful!");
        setFormData({ email: "", password: "" }); // Clear the form
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user.userid);
        localStorage.setItem("userType", data.user.user_type);        
        navigate("/digA/profile"); // Redirect after successful login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors); // Set validation errors
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

          <div className="w-full md:w-3/4 h-full md:h-3/4 flex flex-col justify-center items-center shadow-2xl shadow-indigo-500/50 rounded-xl p-4">
            <p className="text-4xl md:text-7xl mb-8">Log In</p>

            <div className="max-w-sm w-full mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${
                  errors.email ? "border-red-500" : "border-blue-600"
                }`}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="max-w-sm w-full mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`py-3 px-4 w-full border-2 rounded-2xl ${
                  errors.password ? "border-red-500" : "border-blue-600"
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex flex-col items-center w-full mt-6 space-y-4">
              <button
                className="w-full lg:w-[25rem] py-3 bg-black text-white font-bold rounded-full focus:outline-none hover:bg-gray-800 transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="w-full lg:w-[25rem] py-3 bg-black text-white font-bold rounded-full focus:outline-none hover:bg-gray-800 transition"
                onClick={() => navigate("/reg", { replace: true })}
              >
                Register
              </button>
            </div>
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
