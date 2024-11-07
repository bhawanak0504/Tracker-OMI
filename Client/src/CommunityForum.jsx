import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import post1 from './assets/post1.jpg';
import post2 from './assets/post2.jpg';
import defaultAvatar from './assets/default-avatar.png';


import { 
  faArrowLeft, 
  faHome, 
  faHeartbeat, 
  faUser, 
  faCalendar, 
  faPhotoVideo, 
  faUserPlus, 
  faUserCheck, 
  faUpload ,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './CommunityForum.css';

const postsData = [
  {
    id: 1,
    name: 'Riya Reddy',
    time: '2 hours ago',
    image: post1,
    text: 'Pregnancy is a journey filled with anticipation, love, and an incredible connection to the life growing within. 🌸🤰',
    likes: 8900,
    comments: [],
    shares: 7000,
    showComments: false,
    following: false,
  },
  {
    id: 2,
    name: 'Liza Bedi',
    time: '1 week ago',
    image: post2,
    text: 'It’s a time to cherish the small moments, embrace the changes, and prepare for the new chapter ahead. 🌸',
    likes: 7300,
    comments: [],
    shares: 5000,
    showComments: false,
    following: false,
  },
];

const currentUser = {
  name: 'You',
  image: defaultAvatar, // Correct usage of imported avatar
};

const CommunityForum = () => {
  const [posts, setPosts] = useState(postsData);
  const [newPostText, setNewPostText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('suggested'); // State to track the active tab
  const [postImage, setPostImage] = useState(null); // State for the uploaded image
  const [previewImage, setPreviewImage] = useState(null); // URL for preview

  const navigate = useNavigate();

  const handleLike = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
  };

  const handleNewPost = async () => {
    if (!newPostText && !postImage) {
      alert('Please enter text or upload an image.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', postImage); // Append the image file
    formData.append('text', newPostText); // Append the post text
  
    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get the actual response text
        throw new Error(`Server Error: ${errorText}`);
      }
  
      const data = await response.json(); // Parse the JSON response only if successful
  
      // Create a new post using the server's uploaded image URL
      const newPost = {
        id: posts.length + 1,
        name: currentUser.name,
        time: new Date().toISOString(),
        image: data.filePath, // Use the uploaded image path from the server
        text: newPostText,
        likes: 0,
        comments: [],
        shares: 0,
        showComments: false,
        following: false,
      };
  
      setPosts([newPost, ...posts]);
      setNewPostText(''); // Clear the input
      setPostImage(null); // Clear the image input
      setPreviewImage(null); // Remove the preview image
    } catch (error) {
      console.error('Error uploading the post:', error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file); // Store the file for upload
      setPreviewImage(URL.createObjectURL(file)); // Create a URL for the preview
    }
  }; // Semicolon added after the function block
  
  

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };
  

  const handleNewComment = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              { text: newComment, name: currentUser.name, image: currentUser.image },
            ],
          }
        : post
    );
    setPosts(updatedPosts);
    setNewComment('');
  };

  const toggleComments = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    );
    setPosts(updatedPosts);
  };

  const handleFollow = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, following: !post.following } : post
    );
    setPosts(updatedPosts);
  };

  const handleShare = (text) => {
    const shareMessage = `Check out this post: "${text}"`;
    const url = `https://yourwebsite.com/posts/${text}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Community Forum Post',
          text: shareMessage,
          url,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url);
      alert('Post link copied to clipboard');
    }
  };


  

  const createPost = (text) => {
    const newPost = {
      id: posts.length + 1,
      text,
      time: new Date().toISOString(), // Store the current time
      image: data.filePath
    };
    setPosts([...posts, newPost]);
    setPostImage(null); 
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const seconds = Math.floor((now - postTime) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  };

  // Get a list of profiles that the current user is following
  const followingProfiles = posts.filter(post => post.following);

  return (
    <div className="forum-container">
      <header className="forum-header">
        <div className="back">
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => navigate('/dashboard')} />
        </div>
        <h1>Community Forum</h1>
      </header>

      <div className="tab-menu">
        <button className={`tab ${activeTab === 'suggested' ? 'active' : ''}`} onClick={() => setActiveTab('suggested')}>Suggested</button>
        <button className={`tab ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>Following</button>
        <button className={`tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>Community Chat</button>
      </div>

      <div className="post-list">
        {activeTab === 'following' ? (
          // Render only profiles of users the current user is following
          followingProfiles.length > 0 ? (
            followingProfiles.map((post) => (
              <div className="profile" key={post.id}>
                <img src={defaultAvatar} alt="profile" className="profile-pic" />

                <div>
                  <h2>{post.name}</h2>
                </div>
                <div
                  className={`follow-icon ${post.following ? 'following' : ''}`}
                  onClick={() => handleFollow(post.id)}
                  role="button"
                  tabIndex={0} // Make it focusable for accessibility
                  onKeyDown={(e) => e.key === 'Enter' && handleFollow(post.id)} // Handle Enter key for accessibility
                >
                  <FontAwesomeIcon icon={post.following ? faUserCheck : faUserPlus} />
                </div>
              </div>
            ))
          ) : (
            <p>No profiles followed yet.</p>
          )
        ) : (
          // Render full posts in other tabs
          posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post-header">
                <img
                  src={post1}
                  alt="profile"
                  className="profile-pic"
                />
                <div>
                <h2>{post.name}</h2>
                <span className="time">{formatTimeAgo(post.time)}</span> {/* Updated time display */}
              </div>
                <div
                  className={`follow-icon ${post.following ? 'following' : ''}`}
                  onClick={() => handleFollow(post.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleFollow(post.id)}
                >
                  <FontAwesomeIcon icon={post.following ? faUserCheck : faUserPlus} />
                </div>
              

              </div>
              <p className="post-text">{post.text}</p>
              {post.image && <img src={`http://localhost:3001${post.image}`} alt="Post" className="post-image"  style={{ width: '300px', height: 'auto' }}/>}
              {/* Render post image */}
              <div className="post-footer">
                <span onClick={() => handleLike(post.id)}>❤️ {post.likes}</span>
                <span onClick={() => toggleComments(post.id)}>💬 {post.comments.length}</span>
                <span onClick={() => handleShare(post.text)}>🔄 {post.shares}</span>
                {post.name === currentUser.name && (
                  <span
                    className="delete-icon"
                    onClick={() => handleDeletePost(post.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDeletePost(post.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                )}
              </div>

              {post.showComments && (
                <div className="comments-section">
                  <div className="comments-list">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <img src={comment.image} alt="commenter" className="profile-pic small" />
                        <div className="comment-text">
                          <strong>{comment.name}:</strong> {comment.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={() => handleNewComment(post.id)}>Comment</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <button className="plus-button" onClick={() => setModalOpen(true)}>
        +
      </button>

      {isModalOpen && (
        <div className="modal">
          <textarea
            placeholder="Write your post here..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />
          <div className="image-upload">
            <label htmlFor="image-upload" className="upload-label">
              <FontAwesomeIcon icon={faUpload} /> Upload Image
            </label>
            <input
  type="file"
  id="image-upload"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, GIF).');
        return;
      }

      // Validate file size (e.g., 5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('The file size exceeds the 5MB limit.');
        return;
      }

      // Set the image file for uploading
      setPostImage(file);

      // Create a URL for image preview
      setPreviewImage(URL.createObjectURL(file));
    }
  }}
/>

          </div>
          {postImage && <img src={postImage} alt="New post" className="preview-image" />} {/* Show preview of the uploaded image */}
          <button onClick={handleNewPost}>Post</button>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
      )}


<footer className="footer">
        <button className="footer-btn active-icon">
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faCalendar} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faHeartbeat} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faPhotoVideo} />
        </button>
        <button className="footer-btn">
          <FontAwesomeIcon icon={faUser} />
        </button>
      </footer>
    </div>
  );
};


export default CommunityForum;

