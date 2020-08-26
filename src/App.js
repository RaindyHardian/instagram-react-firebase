import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Components/Post';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { db,auth } from './firebase';
import ImageUpload from './Components/ImageUpload';

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser) {
        // user has logged in
        // console.log(authUser)
        setUser(authUser)
      } else {
        // user has logged out
        setUser(null)
      }
    })
    
    return ()=>{
      unsubscribe()
    }
  },[user, username])

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      snapshot.docs.map(doc=>{ // the whole data
        console.log(doc.data()) // single data
      })

      // assign the data to posts state
      setPosts(snapshot.docs.map(doc=>(
        {
          id: doc.id,
          post: doc.data()
        }
      )))
    })

  },[])

  const signUp = (e)=>{
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName: username,
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
         {user?(
            <Button onClick={()=>auth.signOut()}>Log out</Button>
          ):(
            <div>
              <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      
      
      {user? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>You need to login</h3>
      )}

      {posts.map(({id, post})=>(
        <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))}
      
              
    </div>
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
