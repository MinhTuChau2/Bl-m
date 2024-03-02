// ProfileEdit.jsx

import React, { useState } from 'react';

const ProfileEdit = ({ user, handleUpdateProfile }) => {
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    // Add other profile fields here
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Call the function to update user profile with the new data
      await handleUpdateProfile(user.id, formData); // Adjust function arguments as per your implementation
      // Optionally, you can display a success message or navigate to another page
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className="profile-edit">
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
      ></textarea>
      {/* Add other input fields for profile editing */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileEdit;
