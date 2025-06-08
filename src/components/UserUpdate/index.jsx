import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./styles.css";

function UserUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            location: userData.location || "",
            description: userData.description || "",
            occupation: userData.occupation || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/updateUser/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate(`/users/${id}`);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleBack = () => {
    navigate(`/users/${id}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="Occupation"
            />
          </div>
          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows="3"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">
              Update Profile
            </button>
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserUpdate;
