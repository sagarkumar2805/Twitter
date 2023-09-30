import React from "react";
import "./ProfileDetails.css";
import myPic from "../images/myPic.jpg";
import NavBar from "../components/NavBar";
import TweetsCard from "../components/TweetsCard";
import swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useParams } from "react-router-dom";
import { toast} from "react-toastify";

const ProfileDetails = () => {
  const params = useParams();
  const accessToken = localStorage.getItem("token");
  const currentUserID = localStorage.getItem("currentUserID");

  const [showDialog1, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [updateProfileData, setUpdateProfileData] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [tweetContent, setTweetContent] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [update, setUpdate] = useState("");
  const [getTweet, setGetTweet] = useState([]);

  const handleFollow = async () => {
    // console.log(accessToken);
    // console.log(isFollowed);
    // console.log(profileData);
    // console.log(currentUserID);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/${profileData._id}/follow`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Followed user successfully');  
      // console.log("followed");
      setIsFollowed(true);
      setUpdateProfileData(!updateProfileData);
      // console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleUnFollow = async () => {
    // console.log(accessToken);
    // console.log(isFollowed);
    // console.log(profileData);
    // console.log(currentUserID);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/${profileData._id}/unfollow`,
        null,
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Unfollowed user successfully');  
      setIsFollowed(false);
      setUpdateProfileData(!updateProfileData);
      // console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleImageChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();

    if (imageUpload) {
      formData.append("profilePic", imageUpload);
    }

    // Send the POST request to add the new tweet
    await axios
      .post(
        `${API_BASE_URL}/api/user/${profileData._id}/uploadProfilePic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: "Bearer " + accessToken,
          },
        }
      )
      .then((response) => {
        toast.success('Image uploaded successfully');        
        setImageUpload(!imageUpload);
        setShowDialog(false);
        console.log(response.data);
        showHideDialog2();
      })
      .catch((error) => {
        toast.error(error);
        console.log(error);
      });
  };

  const showHideDialog = () => {
    setShowDialog(!showDialog1);
  };

  const showHideDialog2 = () => {
    setShowDialog2(!showDialog2);
  };

  const handleTweetContentChange = (event) => {
    setTweetContent(event.target.value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleProfileEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/user/${profileData._id}/`,
        {
          name: name,
          location: location,
          dob: dateOfBirth,
        },
        {
          headers: {
            token: "Bearer " + accessToken,
          },
        }
      );
      toast.success('Profile edited successfully');  
      setUpdate(res.data);
      showHideDialog();
      console.log(res.data); // Log the response from the server
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/user/${params.id}`,
          {
            headers: {
              token: "Bearer " + accessToken,
            },
          }
        );
        setProfileData(response.data);
        setIsFollowed(response.data.followers.includes(currentUserID));
        setUpdate(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error loading tweets", error);
      }
    };
    getProfileDetails();
  }, [isFollowed, update]);

  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/user/${profileData._id}/tweets`
        );

        setGetTweet(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error loading tweets", error);
      }
    };
    getTweets();
  }, [profileData._id, update]);

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="sideBar-container">
          <NavBar />
        </div>
        <div className="profile-section w-100">
          <div className="row">
            <h4>Profile</h4>
            <div className="col-12 blue-background"></div>
          </div>
          <div>
            <div className="profile-pic">
              <div>
                <img
                  alt="profilePic"
                  src={
                    profileData.profilePic
                      ? API_BASE_URL + "/" + profileData.profilePic
                      : myPic
                  }
                  height="120px"
                  width="120px"
                  className="profile-picImg"
                />
              </div>
              {params.id === currentUserID ? (
                <div className="d-flex">
                  <div className="follow-btn mt-2">
                    <button
                      type="submit"
                      className="custom-btn"
                      onClick={() => {
                        setShowDialog(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="follow-btn mt-2">
                    <button
                      type="submit"
                      className="custom-btn"
                      onClick={() => {
                        setShowDialog2(true);
                      }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="follow-btn mt-2">
                  <button
                    type="submit"
                    className="custom-btn"
                    onClick={() => {
                      isFollowed ? handleUnFollow() : handleFollow();
                    }}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="col">
                <h5>{profileData.name}</h5>
              </div>
              <div className="col">@{profileData?.userName}</div>
            </div>
            <div className="personal-details d-flex">
              <div className="dob d-flex">
                <i class="fa-solid fa-cake-candles"></i>
                <p>{formatDate(profileData.dob)}</p>
              </div>
              <div className="location d-flex">
                <i class="fa-solid fa-location-dot"></i>
                <p>{profileData.location}</p>
              </div>
            </div>

            <div className="last-used d-flex">
              <i class="fa-solid fa-calendar-days"></i>
              <p>Joined At - {formatDate(profileData?.createdAt)}</p>
            </div>

            <div className="follow-section">
              <div className="Following">
                <p>{profileData?.followers?.length} Followers </p>
              </div>
              <div className="follower">
                <p>{profileData?.following?.length} Following </p>
              </div>
            </div>
            <div className="d-flex justify-content-center pt-5 pb-3 flex-column ">
              <div className="text-center">
                <h5>Tweets and Replies</h5>
              </div>
              <div className="sideBar-container">
                {getTweet.map((tweets) => {
                  return (
                    <TweetsCard
                      key={tweets._id}
                      setUpdateTweet={setUpdate}
                      tweet={tweets}
                      updateTweet={update}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="sideBar-container"></div>
        </div>
      </div>
      <Modal show={showDialog1} onHide={showHideDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="Date of Birth"
            rows={2}
            style={{ width: "100%", resize: "none" }}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            rows={2}
            style={{ width: "100%", resize: "none" }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            rows={2}
            style={{ width: "100%", resize: "none" }}
          />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={showHideDialog}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileEdit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDialog2} onHide={showHideDialog2}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Pic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={showHideDialog2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileDetails;
