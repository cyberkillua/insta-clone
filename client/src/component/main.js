import React, { useReducer, createContext, useEffect, useContext } from "react";
import Navbar from "./navbar";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";
import Creatpost from "./Createpost";
import UserProfile from "./UserProfile"
import FollowingPost from "./FollowingPost"
import Home from "./Home";
import { Route, useHistory, Switch } from "react-router-dom";
import { reducer, initialstate } from "../Reducers/UserReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user});
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/Signin">
        <Signin />
      </Route>
      <Route exact path="/Signup">
        <Signup />
      </Route>

      <Route exact path="/Profile">
        <Profile />
      </Route>
      <Route exact path="/Profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/Create">
        <Creatpost />
      </Route>
      <Route exact path="/followedpost">
        <FollowingPost />
      </Route>
    </Switch>
  );
};

const Main = () => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  return (
    <UserContext.Provider value={{state, dispatch }}>
      <Navbar />
      <Routing />
    </UserContext.Provider>
  );
};

export default Main;
