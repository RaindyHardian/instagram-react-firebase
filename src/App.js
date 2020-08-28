import React,{useState, useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { db,auth } from './firebase';
import ImageUpload from './Components/ImageUpload';
import BottomNav from './Components/BottomNav';
import Home from './Components/Home';
import Post from './Components/Post';

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser) {
        // user has logged in
        console.log(authUser.user)
        setUser(authUser)
        setIsLoggedIn(true)
        setIsLoading(false)
      } else {
        // user has logged out
        setUser({})
        setIsLoggedIn(false)
        setIsLoading(false)
      }
    })
    
    return ()=>{
      unsubscribe()
    }
  },[])

  const signUp = (e)=>{
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName: username,
      })
      db.collection("users").doc(authUser.user.uid).set({
        bio: "",
        displayName: username,
        email : authUser.user.email
      })
      setOpen(false);
    })
    .catch((err)=> {
      alert(err.message)
    })
  }

  const signIn = (e)=>{
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .then(()=>{
      setOpenSignIn(false)
    })
    .catch((err)=>{
      alert(err.message)
    })
    
  }
  return (
    <Router>
    <div className="app">
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
         <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
         />
         {
          isLoading?'':(
            isLoggedIn?(
              <Button onClick={()=>auth.signOut()}>Log out</Button>
            ):(
              <div>
                <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={()=>setOpen(true)}>Sign Up</Button>
              </div>
            )  
          )
        }
      </div>
      {/* {user? (
        <ImageUpload username={user.displayName} user_id={user.uid}/>
      ):(
        <h3>You need to login to upload an image</h3>
      )} */}
      {/* {posts.map(({id, post, username})=>(
        <Post key={id} postId={id} username={username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))}  */}
      <div className="app__container">
      <Switch>
        <Route exact path="/">
          <Home user={user} isLoggedIn={isLoggedIn}/>
        </Route>
        <Route exact path="/upload">
          <ImageUpload/>
        </Route>
      </Switch>
      </div>
      {isLoading?'':(
        <BottomNav user={user}/>
      )}
      
    </div>
    </Router>
  );
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default App;
