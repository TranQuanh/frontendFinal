import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ photoUpdateTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [photoComments, setPhotoComments] = useState({}); // Lưu comment cho từng ảnh: { photoId: commentText }

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

  return (
    <>
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
                                {comment.user.first_name}{" "}
                                {comment.user.last_name}
                              </Link>
                            </div>
                            <div className="comment-content">
                              {comment.comment}
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
    </>
  );
}

export default UserPhotos;
