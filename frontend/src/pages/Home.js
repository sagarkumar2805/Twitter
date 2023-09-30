import React from "react";
import "./Home.css";
import tweetImage from "../images/tweetImage.jpeg";
import myPic from "../images/myPic.jpg";
import NavBar from "../components/NavBar";
import TweetsCard from "../components/TweetsCard";
import swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast} from "react-toastify";


const Home = () => {
  const [allTweets, setAllTweets] = useState([]);
  const [updateTweet, setUpdateTweet] = useState(false);
  const [tweetContent, setTweetContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const currentUser = localStorage.getItem("token");

  if (currentUser === null || currentUser === undefined) {
    window.location.href = "/login";
  }
  const handleTweetContentChange = (event) => {
    setTweetContent(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleTweetSubmit = () => {
    const accessToken = localStorage.getItem("token");

    if (!tweetContent) {
      console.error("Tweet content is required.");
      return;
    }

    // Create a new FormData object to send the tweet content and image as multipart/form-data
    const formData = new FormData();
    formData.append("content", tweetContent);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Send the POST request to add the new tweet
    axios
      .post(`${API_BASE_URL}/api/tweet`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setUpdateTweet(!updateTweet);
        // Handle the response if needed (e.g., show success message, refresh tweets list)
        setShowDialog(false); // Close the modal after successful tweet submission
      })
      .catch((error) => {
        console.error("Error adding tweet:", error);
        // Handle the error if needed (e.g., show error message)
      });
  };

  const getTweets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tweet/`);
      if (response.status === 200) {
        setAllTweets(response.data.tweets);
      }
    } catch (error) {
      console.log("error loading tweets", error);
    }
  };

  useEffect(() => {
    getTweets();
  }, [updateTweet]);

  const [showDialog, setShowDialog] = useState(false);

  const showHideDialog = () => {
    setShowDialog(!showDialog);
  };

  console.log(allTweets);

  return (
    <div className="page-container">
      <div className="home-container">
        <div className="sideBar-container">
          <NavBar />
        </div>
        <div className="home-section">
          <div className="home-text-btn mb-3">
            <div>
              <h4 className="mt-2">Home</h4>
            </div>
            <div className="btn">
              <button
                type="submit"
                className="tweet-btn"
                onClick={() => {
                  setShowDialog(true);
                }}
              >
                Tweet
              </button>
            </div>
          </div>

          <div className="sideBar-container">
            {allTweets?.map((tweets) => {
              // console.log(tweets)
              return (
                <TweetsCard
                  key={tweets._id}
                  setUpdateTweet={setUpdateTweet}
                  tweet={tweets}
                  updateTweet={updateTweet}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Modal show={showDialog} onHide={showHideDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={tweetContent}
            onChange={handleTweetContentChange}
            placeholder="Write your tweet..."
            rows={4}
            style={{ width: "100%", resize: "none" }}
          />
          <div className="mb-3">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={showHideDialog}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTweetSubmit}>
            Add Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
