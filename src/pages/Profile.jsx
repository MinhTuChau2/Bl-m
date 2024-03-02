// Profile.jsx

import React, { useState, useEffect } from 'react';

const Profile = ({ handleUpdateProfile }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    // Add other profile fields here
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    // Assuming you have a function to fetch user data from the server
    // Replace fetchUserData with your own function to fetch user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user data from the server
      const response = await fetch('/api/user'); // Adjust endpoint as per your server setup
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Set form data with user's current profile information
        setFormData({
          bio: userData.bio || '',
          // Initialize other profile fields here
        });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Call the function to update user profile with the new data
      await handleUpdateProfile(user.id, formData); // Adjust function arguments as per your implementation
      setIsEditing(false);
      // Optionally, you can update the local user state with the updated data
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="profile">
      {user && (
        <>
          <img src={user.profilePicture} alt="Profile" />
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          ) : (
            <p>{user.bio}</p>
          )}
          {/* Display other profile information */}
          {isEditing ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
