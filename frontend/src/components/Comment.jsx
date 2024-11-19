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

const Comment = ({ comments = [] }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [showSort, setShowSort] = useState(false);
  const [addComment, setAddComment] = useState("");
  const [showCommentControl, setShowCommentControl] = useState(false);

  const commentRef = useRef([]);
  const [readMoreVisibility, setReadMoreVisibility] = useState([]);

  useEffect(() => {
    const readMoreVisibility = commentRef.current.map((_, index) => {
      const isHidden =
        getComputedStyle(commentRef.current[index]).getPropertyValue(
          "height"
        ) === "95px";

      return isHidden;
    });

    setReadMoreVisibility(readMoreVisibility);
  }, [comments]);

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
        <Avatar src="" alt="" />
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
              <button onClick={() => setShowCommentControl(false)}>
                Cancel
              </button>
              <button disabled={!addComment}>Comment</button>
            </div>
          )}
        </div>
      </div>
      <div className="commentBox">
        {comments.map((comment, index) => (
          <div className="comment" key={comment._id}>
            <Avatar src="" alt="" />
            <div className="commentDetails">
              <div className="commentUploadDetails">
                <span className="username">@subrata</span>
                <span className="uploadTime">
                  {timeSince(comment.createdAt)}
                </span>
              </div>
              <p
                className={`commentText ${comment?.hide ? "hide" : ""}`}
                ref={(e) => (commentRef.current[index] = e)}
              >
                {comment.content}
              </p>
              {readMoreVisibility[index] && (
                <span
                  className="readMoreBtn"
                  onClick={() =>
                    setComments((prev) =>
                      prev.map((c) =>
                        c._id === comment._id ? { ...c, hide: !c.hide } : c
                      )
                    )
                  }
                >
                  {comment?.hide ? "Read More" : "Read Less"}
                </span>
              )}
              <button className="commentLike">
                <ThumbUpAltOutlined fontSize="small" />
              </button>
            </div>
            {comment.owner?.username === userData.username && (
              <MoreVertOutlined fontSize="small" className="moreOptions" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
