import React, {useState, useEffect} from 'react'
import { Avatar, Button, Input, CircularProgress, Menu, MenuItem } from '@material-ui/core';
import firebase from "firebase"
import { db } from '../firebase';

// import {Menu} from '@material-ui/core';
// import MenuItem from '@material-ui/core/MenuItem';

const Post = ({postId, username, caption, imageUrl, isLoggedIn, loggedInUser_id}) => {
    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState("");
    const [postLoading, setPostLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    useEffect(()=>{
        // console.log(postId)
        if(postId){
            db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'asc').onSnapshot( async snapshot=>{
                setComments(await Promise.all(snapshot.docs.map(async doc=>{
                    let user = await doc.data().user_id.get()
                    return {
                        id : doc.id,
                        comment : doc.data(),
                        username : user.data().displayName
                    }
                })))
            })
        }
    },[])
    const postComment = ()=>{
        setPostLoading(true)
        db.collection(`posts/${postId}/comments`).add({
            text: inputComment,
            user_id: db.doc('users/' + loggedInUser_id),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(()=>{
            setInputComment('')
            setPostLoading(false)
        }).catch(err=>{
            setPostLoading(false)
        })
        console.log(loggedInUser_id)
        console.log(inputComment)
    }

    const dotClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const dotClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="post">
            <div className="post__header">
                <div className="post__profile">
                    <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                    <h3>{username}</h3>
                </div>
                <div className="post__menu" aria-controls="simple-menu" aria-haspopup="true" onClick={dotClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={dotClose}
                >
                    <MenuItem onClick={dotClose}>Delete Post</MenuItem>
                </Menu>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt=""/>
            
            <div className="post__action">
                <div className="post__actionSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div className="post__actionSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
            </div>
            {/* username + caption */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            {comments.map(({id, comment,username})=>(
                <h4 className="post__text" key={id}>
                    <strong>{username}</strong> {comment.text}
                </h4>
            ))}
            {isLoggedIn?(
                <div className="post__comment">
                    <input type="text" className="post__commentInput" placeholder="Add a comment..." value={inputComment} onChange={(e)=>setInputComment(e.target.value)}/>
                    {inputComment===''?'':(
                        <>
                        {postLoading?(<CircularProgress />):(
                            <button className="post__commentButton" onClick={postComment}>Post</button>
                        )}
                        </>
                    )}
                </div>
            ):''}
            
        </div>
    )
}

export default Post
