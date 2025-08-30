import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPosts, getAllPosts } from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [viewingUserPosts, setViewingUserPosts] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile and posts on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchUserPosts(storedUser._id);
    }
  }, [navigate]);

  // Fetch the logged-in user's posts
  const fetchUserPosts = async (userId) => {
    try {
      const res = await getUserPosts(userId);
      setUserPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch user posts", err);
    }
  };

  // Fetch all posts from other users
  const fetchOtherPosts = async () => {
    try {
      const res = await getAllPosts();
      setOtherPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch other posts", err);
    }
  };

  const handleTabChange = (isUserPosts) => {
    setViewingUserPosts(isUserPosts);
    if (!isUserPosts) {
      fetchOtherPosts();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {user && (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Tabs to toggle between user posts and other users' posts */}
          <div className="flex gap-6 mb-6">
            <button
              onClick={() => handleTabChange(true)}
              className={`px-6 py-2 rounded-lg ${viewingUserPosts ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Your Posts
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`px-6 py-2 rounded-lg ${!viewingUserPosts ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Other Users' Posts
            </button>
          </div>

          {/* Display posts based on selected tab */}
          <div className="space-y-6">
            {viewingUserPosts ? (
              <div>
                <h3 className="text-2xl font-semibold">Your Posts</h3>
                {userPosts.length === 0 ? (
                  <p>No posts found. Start creating some!</p>
                ) : (
                  <ul className="space-y-4">
                    {userPosts.map((post) => (
                      <li key={post._id} className="p-4 bg-white rounded-lg shadow-md">
                        <h4 className="font-semibold text-xl">{post.title}</h4>
                        <p>{post.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold">Other Users' Posts</h3>
                {otherPosts.length === 0 ? (
                  <p>No posts available.</p>
                ) : (
                  <ul className="space-y-4">
                    {otherPosts.map((post) => (
                      <li key={post._id} className="p-4 bg-white rounded-lg shadow-md">
                        <h4 className="font-semibold text-xl">{post.title}</h4>
                        <p>{post.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
