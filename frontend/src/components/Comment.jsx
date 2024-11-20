import React, { useEffect, useRef, useState } from "react";
import "../styles/Comment.css";
import {
  MoreVertOutlined,
  SortOutlined,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { timeSince } from "../utiles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { commentService } from "../backendServices";

const Comment = ({ comments = [], setComments, videoId }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [showSort, setShowSort] = useState(false);
  const [addComment, setAddComment] = useState("");
  const [isCommentUpdatable, setIsCommentUpdatable] = useState(false);
  const [showCommentControl, setShowCommentControl] = useState(false);
  const navigate = useNavigate();

  const navigateUserProfile = (username) => {
    navigate(`/users/${username}`);
  };

  const deleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (commentId) => {
    try {
      if (!isCommentUpdatable) {
        const comment = await commentService.addComment(
          videoId,
          null,
          addComment
        );
        setComments((prev) => [...prev, comment]);
        setAddComment("");
      } else {
        const comment = await commentService.updateComment(
          commentId,
          addComment
        );
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, content: addComment } : c
          )
        );
        setAddComment("");
        setIsCommentUpdatable(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="commentContainer">
      <div className="commentSort">
        <h2>{0} Comments</h2>
        <div className="sort">
          <span onClick={() => setShowSort(!showSort)}>
            <SortOutlined fontSize="large" /> Sort by
          </span>
          {showSort && (
            <div className="options">
              <span value="newest">Newest</span>
              <span value="populer">Populer</span>
            </div>
          )}
        </div>
      </div>

      <div className="commentInputContainer">
        <Avatar src={userData?.avatar} />
        <div className="inputField">
          <input
            type="text"
            placeholder="Add a Comment..."
            onChange={(e) => setAddComment(e.target.value)}
            value={addComment}
            onFocus={() => setShowCommentControl(true)}
          />
          {showCommentControl && (
            <div className="commentBtns">
              <button
                onClick={() => {
                  setShowCommentControl(false);
                  setIsCommentUpdatable(false);
                  setAddComment("");
                }}
              >
                Cancel
              </button>
              <button disabled={!addComment}>
                {isCommentUpdatable ? "Update" : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="commentBox">
        {comments.map((comment, index) => (
          <div className="comment" key={comment._id}>
            <Avatar
              src={comment.owner?.avatar}
              alt={comment.owner?.username}
              onClick={() => navigateUserProfile(comment.owner?.username)}
              className="commentAvatar"
            />
            <div className="commentDetails">
              <div className="commentUploadDetails">
                <span className="username">@{comment.owner?.username}</span>
                <span className="uploadTime">
                  {timeSince(comment.createdAt)}
                </span>
              </div>
              <p
                className="commentText hide"
                onClick={(e) => e.target.classList.toggle("hide")}
              >
                {comment.content}
              </p>
              <button className="commentLike">
                <ThumbUpAltOutlined fontSize="small" /> {comment.totalLikes}
              </button>
            </div>
            {comment.owner?.username === userData.username && (
              <div className="moreOptions">
                <MoreVertOutlined
                  fontSize="small"
                  onClick={(e) => {
                    e.target.nextElementSibling.classList.toggle("hide");
                  }}
                />
                <div className="options hide">
                  <span
                    onClick={(e) => {
                      setIsCommentUpdatable(true);
                      setAddComment(comment.content);
                      setShowCommentControl(true);
                      e.target.parentElement.classList.add("hide");
                    }}
                  >
                    Edit
                  </span>
                  <span onClick={() => deleteComment(comment._id)}>Delete</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
