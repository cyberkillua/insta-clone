import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./main";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  //   console.log(userid);
  useEffect(() => {
    fetch("/user" + userid, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile(result);
        // if(result.user.followers.includes(state._id)){
        //   setShowFollow(false)
        // }
      });
  }, []);
  console.log(state)

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //   console.log(data)
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        })
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowid: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //   console.log(data)
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
            const newfollowers = prevState.user.followers.filter(item=>item != data._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [newfollowers],
            },
          };
        })
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "35em", margin: "0px auto" }}>
          <div className="top-div">
            <div>
              <img
                style={{ width: "8em", height: "8em", borderRadius: "4em" }}
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "104%",
                }}>
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {userProfile.user.followers.includes(state._id)
              ?
              <button
              style={{margin:"10px"}}
                onClick={() => {
                  unfollowUser();
                }}
                className="btn waves-effect waves-light #2196f3 blue darken-1"
                type="submit">
                UNFOLLOW
              </button>
              :
              <button
              style={{margin:"10px"}}
                onClick={() => {
                  followUser();
                }}
                className="btn waves-effect waves-light #2196f3 blue darken-1"
                type="submit">
                FOLLOW
              </button>
              }
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
};

export default Profile;
