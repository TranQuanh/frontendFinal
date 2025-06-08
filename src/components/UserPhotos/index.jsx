import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ currentUser, photoUpdateTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [photoComments, setPhotoComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("URL userId:", userId);
    if (currentUser) {
      console.log("Current User ID type:", typeof currentUser._id);
      console.log("URL userId type:", typeof userId);
      console.log(
        "Is same user?",
        currentUser._id.toString() === userId.toString()
      );
    }
  }, [currentUser, userId]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/photoOfUser/${userId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const photosData = await response.json();
        setPhotos(photosData);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPhotos();
    }
  }, [userId, photoUpdateTrigger]);

  // Cập nhật comment cho một ảnh cụ thể
  const handleCommentChange = (photoId, newComment) => {
    setPhotoComments((prev) => ({
      ...prev,
      [photoId]: newComment,
    }));
  };

  const handleAddComment = async (photoId) => {
    const commentText = photoComments[photoId];
    if (!commentText || !commentText.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/commentOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ comment: commentText }),
        }
      );

      if (response.ok) {
        // Xóa comment đã nhập của ảnh đó
        setPhotoComments((prev) => ({
          ...prev,
          [photoId]: "",
        }));
        // Refresh lại danh sách ảnh
        await fetchPhotos();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/delete/${photoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Refresh photos list after deletion
        await fetchPhotos();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Error deleting photo");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleUpdateComment = async (photoId, commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/photo/commentUpdate/${photoId}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ comment: editCommentText }),
        }
      );

      if (response.ok) {
        setEditingComment(null);
        setEditCommentText("");
        await fetchPhotos();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Error updating comment");
    }
  };

  return (
    <div className="user-photo">
      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo._id} className="photo-item">
              <div className="photo-image">
                <div className="image-space">
                  <img
                    src={`${API_BASE_URL}/images/${photo.file_name}`}
                    alt={photo.file_name}
                    style={{ width: "100%", maxWidth: "400px" }}
                  />
                  {currentUser &&
                    currentUser._id.toString() === userId.toString() && (
                      <button
                        className="btn delete-photo-button"
                        onClick={() => handleDeletePhoto(photo._id)}
                      >
                        Delete Photo
                      </button>
                    )}
                </div>
              </div>
              <div className="photo-date">
                {new Date(photo.date_time).toLocaleString()}
              </div>
              <div className="comment-space">
                <div className="comment-headline">Comments:</div>
                <div className="comment-list">
                  {photo.comments &&
                    photo.comments.length > 0 &&
                    photo.comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-content-wrapper">
                          <div className="comment-author">
                            <Link to={`/users/${comment.user._id}`}>
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                          </div>
                          <div className="comment-content">
                            {editingComment === comment._id ? (
                              <div className="edit-comment-inline">
                                <input
                                  type="text"
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  className="edit-comment-input"
                                  autoFocus
                                />
                                <div className="edit-buttons">
                                  <button
                                    className="btn update-button"
                                    onClick={() =>
                                      handleUpdateComment(
                                        photo._id,
                                        comment._id
                                      )
                                    }
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="btn back-button"
                                    onClick={handleCancelEdit}
                                  >
                                    Back
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="comment-text-container">
                                <span className="comment-text">
                                  {comment.comment}
                                </span>
                                {currentUser &&
                                  currentUser._id &&
                                  comment.user &&
                                  comment.user._id &&
                                  currentUser._id.toString() ===
                                    comment.user._id.toString() && (
                                    <button
                                      className="btn edit-comment-button"
                                      onClick={() => handleEditComment(comment)}
                                    >
                                      Edit
                                    </button>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="comment-date">
                          {new Date(comment.date_time).toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="comment-input">
                  <label>Your comment:</label>
                  <input
                    type="text"
                    value={photoComments[photo._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(photo._id, e.target.value)
                    }
                    placeholder="Add a comment..."
                    className="form-field full-width"
                  />
                  <button
                    className="btn comment-button"
                    onClick={() => handleAddComment(photo._id)}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-photos">No photos found</div>
        )}
      </div>
    </div>
  );
}

export default UserPhotos;
