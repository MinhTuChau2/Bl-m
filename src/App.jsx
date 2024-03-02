// App.jsx

import "./App.css";
import "./DropDownCss.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileCreation from "./pages/ProfileCreation";
import ProfileEdit from "./pages/ProfileEdit";
import Search from "./Search";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuth(user ? true : false);
    });

    return () => unsubscribe();
  }, []);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const newUser = await response.json();
        console.log('User registered:', newUser);
        // Optionally, update state or perform any other action
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleUpdateProfile = async (userId, profileData) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('User profile updated:', updatedUser);
        // Optionally, update state or perform any other action
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <Router>
      <nav>
        <Link to="/"> Home </Link>
        {!isAuth ? (
          <Link to="/login"> Login </Link>
        ) : (
          <>
            <div className="dropdown">
              <Link to="/createpost"> Create Post </Link>
              <Link to="/profile"> Profile </Link>

              <button onClick={signUserOut}> Log Out</button>
            </div>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        {isAuth ? (
          <>
            <Route
              path="/profile"
              element={<Profile handleUpdateProfile={handleUpdateProfile} />}
            />
            <Route path="/profile/create" element={<ProfileCreation />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </>
        ) : (
          <Route path="/profile" element={<Navigate to="/login" />} />
        )}
      </Routes>

    </Router>
  );
}

export default App;
