import React, { useState, useEffect } from "react";
import Navb from "./Navb";

const Profile = () => {
  const userEmail = localStorage.getItem("email"); // Replace with dynamic email from context/auth
  const [profile, setProfile] = useState({
    username: "",
    email: userEmail,
    phone_number: "",
    user_image: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/profile?email=${encodeURIComponent(userEmail)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        const { user_image, ...rest } = data;

        // Convert binary image data to a Base64 string for display
        if (user_image) {
          rest.user_image = `data:image/jpeg;base64,${user_image}`;
        }
        setProfile(rest);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("email", userEmail);
    formData.append("username", profile.username);
    formData.append("phone_number", profile.phone_number);
    if (file) {
      formData.append("user_image", file);
    }

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Navb />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Profile
          </h2>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={profile.user_image || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
              <label
                htmlFor="file-input"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
              >
                <i className="fas fa-camera"></i>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number:
              </label>
              <input
                type="text"
                name="phone_number"
                value={profile.phone_number}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Profile Picture:
              </label>
              <input
                type="file"
                id="file-input"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
