import React from "react";
import myPic from "../images/myPic.jpg";
import "./TweetDetails.css";
import NavBar from "../components/NavBar";
import TweetsCard from "../components/TweetsCard";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast} from "react-toastify";

const TweetDetails = () => {
  const params = useParams();  
  const currentUserID = localStorage.getItem("currentUserID");  
  const accessToken = localStorage.getItem("token");
  
  const [tweetDetails, setTweetDetails] = useState("");
  const [updateTweet, setUpdateTweet] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [reply, setReply] = useState("");

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweetDetails._id}/like`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('User  liked successfully'); 
      // console.log("liked");
      setIsLiked(true);
      setUpdateTweet(!updateTweet);
      // console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweetDetails._id}/dislike`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('User  disliked successfully');
      // console.log("dislike");
      setIsLiked(false);

      console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleReply = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweetDetails._id}/reply`,
        { reply },

        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('User replied successfully');
      // console.log("Replied");

      setShowDialog(false);
      console.log(res.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleRetweet = async () => {
    try {
      console.log("Retweeted");
      const res = await axios.post(
        `${API_BASE_URL}/api/tweet/${tweetDetails._id}/retweet`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Retweeted successfully');
      setUpdateTweet(!updateTweet);
      console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/tweet/${tweetDetails._id}`,

        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Deleted tweet successfully');
      // console.log("deleted");
      setUpdateTweet(!updateTweet);
      console.log(res.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const replyContent = (e) => {
    setReply(e.target.value);
  };

  useEffect(() => {
    const getTweetDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/tweet/${params.id}`
        );
        setTweetDetails(response.data);
        // console.log(response)
      } catch (error) {
        console.log("error loading tweets", error);
      }
    };
    getTweetDetails();
  }, [updateTweet, params.id, tweetDetails]);

  // console.log(tweetDetails);

  const showHideDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <div className="page-container">
      <div className="tweet-container">
        <div className="sideBar-container">
          <NavBar />
        </div>
        <div className="tweet-section w-100">
          <div className="mt-2">
            <h5>Tweet</h5>
          </div>
          <div className="d-flex mt-4 w-100 tweet-details">
            <div className=" me-3">
              <img
                alt="profilePic"
                src={myPic}
                height="50px"
                className="tweet-details-profile-pic"
              />
            </div>
            <div>
              <div>
                <div className="d-flex w-100">
                  <div className="fw-bold">
                    @{tweetDetails?.tweetedBy?.userName}
                  </div>

                  <div className="ms-2">
                    {formatDate(tweetDetails?.createdAt)}
                  </div>
                </div>
                <div className="mt-3">{tweetDetails?.content}</div>
              </div>
              <div className="tweet-action d-flex mt-3">
                <div className="like me-5 d-flex">
                  {isLiked ? (
                    <div>
                      <i
                        className="fa-solid fa-heart"
                        onClick={handleDislike}
                      ></i>
                    </div>
                  ) : (
                    <div>
                      <i
                        className="fa-regular fa-heart"
                        onClick={handleLike}
                      ></i>
                    </div>
                  )}
                  <div className="ps-1">{tweetDetails?.likes?.length} </div>
                </div>
                <div className="me-5 d-flex">
                  <div>
                    <i
                      className="fa-regular fa-comment me-2"
                      onClick={() => {
                        setShowDialog(true);
                      }}
                    ></i>
                  </div>
                  <div>{tweetDetails?.replies?.length}</div>
                </div>
                <div className="d-flex">
                  <div>
                    <i
                      class="fa-solid fa-retweet me-2"
                      onClick={handleRetweet}
                    ></i>
                  </div>
                  <div>{tweetDetails?.retweetBy?.length}</div>
                </div>
              </div>
            </div>
            {/* {currentUserID === tweetDetails?.tweetedBy?._id ? (
              <div className="ms-auto">
                <i class="fa-solid fa-trash" onClick={handleDelete}></i>
              </div>
            ) : (
              ""
            )} */}
          </div>
          <div className="mt-4">
            <h5>Replies</h5>
          </div>

          <div className="sideBar-container">
            {tweetDetails?.replies?.map((reply) => {
              console.log(reply);

              return (
                <TweetsCard
                  key={reply._id}
                  setUpdateTweet={setUpdateTweet}
                  tweet={reply}
                  updateTweet={updateTweet}
                />
              );
            })}
          </div>
        </div>
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

export default TweetDetails;
