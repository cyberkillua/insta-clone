import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./main";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "killua77");
      fetch("https://api.cloudinary.com/v1_1/killua77/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic:data.url
            }),
          })
            .then((res) => res.json())
            .then((result) => {

                localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
                dispatch({type:"UPDATEPIC", payload:result.pic})
            })
              
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const uploadPic = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "35em", margin: "0px auto" }}>
      <div className="top-div">
        <div>
          <div>
            <img
              style={{ width: "8em", height: "8em", borderRadius: "4em" }}
              src={state ? state.pic : "loading"}
            />
          </div>
          <div className="file-field input-field">
            <div className="btn #2196f3 blue darken-1">
              <span>Profile Pic</span>
              <input
                type="file"
                onChange={(e) => uploadPic(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
          </div>
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h6>{state ? state.email : "loading"}</h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "104%",
            }}>
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.followers.length : "0"} followers</h6>
            <h6>{state ? state.following.length : "0"} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
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
  );
};

export default Profile;
