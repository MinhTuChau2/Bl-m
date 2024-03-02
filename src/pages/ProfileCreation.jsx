// ProfileCreation.jsx

import React, { useState } from 'react';


const ProfileCreation = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePicture: '', // Add other profile fields here
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Create user profile data
      const userProfileData = {
        username: formData.username,
        email: formData.email,
        profilePicture: formData.profilePicture,
        // Add other profile fields here
      };

      // Add user profile to Firestore
      const userRef = await firestore.collection('users').doc(auth.currentUser.uid);
      await userRef.set(userProfileData);

      // Optionally, you can display a success message or navigate to another page
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  return (
    <div className="profile-creation">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="profilePicture"
        placeholder="Profile Picture URL"
        value={formData.profilePicture}
        onChange={handleChange}
      />
      {/* Add other input fields for profile creation */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileCreation;
