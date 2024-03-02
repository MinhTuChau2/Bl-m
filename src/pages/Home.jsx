// Home.jsx
import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import "./HomePageCss.css";
import SearchBar from "../Search"; // Import the new SearchBar component

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [error, setError] = useState(null);
  const postsCollectionRef = collection(db, "posts");

  const deletePost = async (id) => {
    try {
      const postDoc = doc(db, "posts", id);
      await deleteDoc(postDoc);
      setPostList((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      setError("Error deleting post");
    }
  };

  const addNewPost = async (title, postText) => {
    try {
      const imageUrl = await handleImageUpload();
      const timestamp = serverTimestamp();

      await addDoc(postsCollectionRef, {
        title,
        postText,
        imageUrl: imageUrl ? imageUrl : null,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
        createdAt: timestamp,
      });

      console.log("Post added successfully!");
    } catch (error) {
      console.error("Error adding post:", error);
      setError("Error adding post");
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
        const posts = await Promise.all(
          data.docs.map(async (doc) => {
            const postData = doc.data();
            const author = postData.author;
            let imageUrl = null;

            if (postData.imageUrl) {
              const imageRef = ref(storage, postData.imageUrl);
              try {
                imageUrl = await getDownloadURL(imageRef);
              } catch (error) {
                console.error("Error getting image URL:", error);
                imageUrl = null;
              }
            }

            return { ...postData, id: doc.id, author, imageUrl };
          })
        );

        setPostList(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
      }
    };

    getPosts();
  }, []);

  return (
    <div className="homePage">
      <SearchBar /> {/* Add the SearchBar component here */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="posts-container">
        {postLists.map((post) => (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                <h1>{post.title}</h1>
              </div>
              <div className="deletePost">
                {/* {isAuth && post.author.id === auth.currentUser.uid && (
                  <button onClick={() => deletePost(post.id)}>
                    &#128465;
                  </button>
                )} */}
              </div>
            </div>

            {post.imageUrl && (
              <div className="postImageContainer">
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="postImage"
                />
              </div>
            )}
            <div className="postTextContainer">{post.postText}</div>
            <h3>@{post.author.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
