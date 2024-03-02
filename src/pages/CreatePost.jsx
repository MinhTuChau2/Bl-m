import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [uploadTask, setUploadTask] = useState(null); // Track the upload task
  const [uploadProgress, setUploadProgress] = useState(0);

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const handleImageUpload = async () => {
    if (image) {
      // Create a Storage reference
      const storageRef = ref(storage, `images/${image.name}`);

      // Create an upload task
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Set the upload task for tracking
      setUploadTask(uploadTask);

      // Set up event listeners for progress and errors
      uploadTask.on("state_changed", (snapshot) => {
        // Track progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      // Wait for the upload to complete
      await uploadTask;

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);

      // Reset the upload task and progress
      setUploadTask(null);
      setUploadProgress(0);

      return imageUrl;
    }
    return null;
  };

  const createPost = async () => {
    try {
      // Upload the image and get the URL
      const imageUrl = await handleImageUpload();

      // Add the post to the collection with the timestamp
      await addDoc(postsCollectionRef, {
        title,
        postText,
        imageUrl,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
        createdAt: serverTimestamp(),
      });

      // Navigate back to the home page
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div className="inputGp">
          <label>Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files[0];
              setImage(file);
            }}
          />
        </div>
        {uploadTask && (
          <div className="uploadProgress">
            Uploading: {uploadProgress.toFixed(2)}%
          </div>
        )}
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
