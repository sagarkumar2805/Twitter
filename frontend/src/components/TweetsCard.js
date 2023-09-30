import React from "react";
import myPic from "../images/myPic.jpg";
import "../pages/TweetDetails.css";
import NavBar from "./NavBar";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";
import tweetImage from "../images/tweetImage.jpeg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import './Tweetcard.css';



const TweetsCard = ({ setUpdateTweet, updateTweet, tweet }, props) => {
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const currentUserID = localStorage.getItem("currentUserID");

  const accessToken = localStorage.getItem("token");

  const [showDialog, setShowDialog] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

  const [reply, setReply] = useState("");

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweet._id}/like`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('user liked successfully');
      setIsLiked(true);
      setUpdateTweet(!updateTweet);
      console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweet._id}/dislike`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('user disliked successfully');
      setIsLiked(false);
      setUpdateTweet(!updateTweet);
      // console.log(res.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleReply = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweet._id}/reply`,
        { reply },

        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('user replied successfully');
      // console.log("Replied");
      setUpdateTweet(!updateTweet);
      setShowDialog(false);
      // console.log(res.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const replyContent = (e) => {
    setReply(e.target.value);
  };

  const handleRetweet = async () => {
    try {
      console.log("Retweeted");
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweet._id}/retweet`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('user retweeted successfully');
      setUpdateTweet(!updateTweet);
      // console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/tweet/${tweet._id}`,

        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Deleted tweet successfully');
      // console.log("deleted");
      setUpdateTweet(!updateTweet);
      // console.log(res.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const showHideDialog = () => {
    setShowDialog(!showDialog);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const getTweets = async () => {
      try {
        // console.log(currentUserID);
        tweet?.likes?.some((like) => {
          if (like._id === currentUserID) {
            setIsLiked(true);
          }
        });
      } catch (error) {
        console.log("error loading tweets", error);
      }
    };
    getTweets();
  }, [currentUserID, tweet]);

  // const example = () => {
  //   console.log("hello");
  // };

  return (
    <div className="">
      <div className="d-flex w-100 tweet-details">
        <div className="">
          <img
            alt="profilePic"
            src={myPic}
            height="50px"
            className="tweet-ProfieImg"
          />
        </div>
        <div className="tweet-section">
          <div>retweet by {tweet?.retweetBy?.name}</div>
        
          <div className="abc">
            <div className="user-details">
              <NavLink to={`/profileDetails/${tweet.tweetedBy._id}`} className="myProfile" style={{ textDecoration: 'none' }}>
                <div>
                  <h6>
                    {tweet?.tweetedBy?.name} - {formatDate(tweet?.createdAt)}{" "}
                  </h6>
                </div>
                <div>
                  <p>@{tweet?.tweetedBy?.userName} </p>
                </div>
              </NavLink>
            </div>
            <div>
              <NavLink className="nav-link" to={`/tweetDetails/${tweet._id}`} style={{ textDecoration: 'none' }}>
                <div>
                  <p>{tweet?.content}</p>
                </div>
              </NavLink>
            </div>
            <div>
              {tweet?.image && (
                <img
                  alt="tweetImage"
                  src={API_BASE_URL + "/" + tweet?.image}
                  className="tweetImage"
                />
              )}
            </div>

          </div>

          <div className="d-flex tweet-actions">
            <div className="like">
              {isLiked ? (
                <div>
                  <i className="fa-solid fa-heart" onClick={handleDislike}></i>
                </div>
              ) : (
                <div>
                  <i className="fa-regular fa-heart" onClick={handleLike}></i>
                </div>
              )}
              <div className="ps-1">{tweet?.likes?.length} </div>
            </div>
            <div className="comment">
              <div>
                <i
                  className="fa-regular fa-comment"
                  onClick={() => {
                    setShowDialog(true);
                  }}
                ></i>
              </div>
              <div className="ps-1">{tweet?.replies?.length} </div>
            </div>
            <div className="retweet">
              <div>
                <i className="fa-solid fa-retweet" onClick={handleRetweet}></i>
              </div>
              <div className="ps-1">{tweet?.retweetBy.length} </div>
            </div>
          </div>
        </div>
        {currentUserID === tweet?.tweetedBy?._id ? (
          <div className="ms-auto">
            <i class="fa-solid fa-trash" onClick={handleDelete}></i>
          </div>
        ) : (
          ""
        )}
      </div>

      <Modal show={showDialog} onHide={showHideDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tweet Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={reply}
            onChange={replyContent}
            placeholder="Write your tweet..."
            rows={4}
            style={{ width: "100%", resize: "none" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={showHideDialog}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TweetsCard;
