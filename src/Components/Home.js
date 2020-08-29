import React,{useState, useEffect} from 'react'
import ImageUpload from './ImageUpload';
import Post from './Post';

import {db} from "../firebase"
const Home = (props) => {
    const [posts, setPosts] = useState([])
    let loggedInUser_id;
    if(props.isLoggedIn){
        loggedInUser_id = props.user.uid;
    }
    
    useEffect(()=>{
        db.collection('posts').orderBy('timestamp', 'desc').get().then( snapshot=>{
            snapshot.docs.map( doc=>{
                doc.data().user_id.get().then( user=>{
                    setPosts(prevPosts=>[...prevPosts, {
                        id : doc.id,
                        post : doc.data(),
                        username : user.data().displayName
                    }])  
                })
            })
        })
    },[])
    
    return (
        <div className="home">
            {/* {user? (
                <ImageUpload username={user.displayName} user_id={user.uid}/>
            ):(
                <h3>You need to login to upload an image</h3>
            )} */}
            {posts.map(({id, post, username})=>(
                <Post key={id} postId={id} username={username} caption={post.caption} imageUrl={post.imageUrl} isLoggedIn={props.isLoggedIn} loggedInUser_id={props.isLoggedIn?loggedInUser_id:''}/>
            ))}            
        </div>
    )
}

export default Home