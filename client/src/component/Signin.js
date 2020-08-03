import React,{useState, useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from "./main"

const Signin = ()=>  {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password,setPasword] = useState("")
  const [email,setEmail] = useState("")



  const postData =()=> {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
     return M.toast({ html: "invalid email", classes: "#e53935 red darken-1" })}
     
     fetch("/Signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          dispatch({type:"USER", payload:data.user})
          M.toast({ html: "Sign in sucessful", classes: "#43a047 green darken-1" });
          history.push("/")
        }
      }).catch(err=>{
        console.log(err)
      })
    
    
  }


   
    return (
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
          />
          <button
            onClick={()=>{postData()}}
            className="btn waves-effect waves-light #2196f3 blue darken-1"
            type="submit">
            Sign In
          </button>
            <Link to="/Signup"><h6>Sign up if you dont have an account</h6></Link>
        </div>

      </div>
    );
  
}

export default Signin;
