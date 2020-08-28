import React,{useState, useEffect} from 'react'
import ImageUpload from './ImageUpload';
import Post from './Post';

import {db} from "../firebase"
const Home = () => {
    const [posts, setPosts] = useState([])
    
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
        <div>
            {/* {user? (
                <ImageUpload username={user.displayName} user_id={user.uid}/>
            ):(
                <h3>You need to login to upload an image</h3>
            )} */}
            {posts.map(({id, post, username})=>(
                <Post key={id} postId={id} username={username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))}            
        </div>
    )
}

export default Home
