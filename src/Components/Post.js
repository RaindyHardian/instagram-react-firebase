import React, {useState, useEffect} from 'react'
import {
    Link
} from "react-router-dom";
import { Avatar, Button, Input, CircularProgress, Menu, MenuItem,Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase"
import { db } from '../firebase';
import moment from "moment"

// import {Menu} from '@material-ui/core';
// import MenuItem from '@material-ui/core/MenuItem';

const Post = ({postId, photoUrl, username, caption, imageUrl, timestamp, postUser_id, isLoggedIn, loggedInUser_id}) => {
    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState("");
    const [postLoading, setPostLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [likes, setLikes] = useState([])
    
    
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [modalLikeOpen, setModalLikeOpen] = useState(false)
    const [modalCommentsOpen, setModalCommentsOpen] = useState(false)

    const [likeSVG,setLikeSVG] = useState((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>))

    const deletePostButton = ()=>{
        if(postUser_id == loggedInUser_id){
            return <MenuItem onClick={deletePost}>Delete Post</MenuItem>
        }else{
            return ''
        }
    }

    useEffect(()=>{
        // console.log(postId)
        if(postId){
            // set comments
            var unsubscribeComments = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'asc').onSnapshot( async snapshot=>{
                setComments(await Promise.all(snapshot.docs.map(async doc=>{
                    let user = await doc.data().user_id.get()
                    return {
                        id : doc.id,
                        comment : doc.data(),
                        username : user.data().displayName,
                        user_id : user.id,
                        photoUrl : user.data().photoUrl
                    }
                })))
            })
            
            
            // set likes
            var unsubscribeLikes = db.collection("posts").doc(postId).collection("likes").onSnapshot(async snapshot=>{
                setLikes(await Promise.all(snapshot.docs.map(async doc=>{
                    let user = await doc.data().user_id.get()
                    return {
                        id: doc.id,
                        username : user.data().displayName,
                        user_id : user.id,
                        photoUrl : user.data().photoUrl 
                    }
                })))
            })
        }
        return ()=>{
            unsubscribeComments()
            unsubscribeLikes()
        }
    },[])

    useEffect(()=>{
        likes.map(like=>{
            if(like.id===loggedInUser_id){
                setLikeSVG((<svg style={{color:'#ed4956'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>))
            } else{
                setLikeSVG((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>))
            }
        })
    },[likes, isLoggedIn])

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
    }

    const submitLike = ()=>{
        if(!isLoggedIn){
            return alert("Please login to like a post")
        } else{
            if(likes.length!=0){
                likes.map(like=>{
                    if(like.id==loggedInUser_id){
                        db.collection(`posts/${postId}/likes`).doc(loggedInUser_id).delete().then(()=>{
                            setLikeSVG((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>))
                        })
                    } else{
                        db.collection(`posts/${postId}/likes`).doc(loggedInUser_id).set({
                            user_id: db.doc('users/' + loggedInUser_id),
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        }).then(()=>{
                            setLikeSVG((<svg style={{color:'#ed4956'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>))
                        })
                    }
                })
            }else{
                db.collection(`posts/${postId}/likes`).doc(loggedInUser_id).set({
                    user_id: db.doc('users/' + loggedInUser_id),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }
        }
    }
    
    const deletePost = ()=>{
        if(postUser_id === loggedInUser_id){
            // alert("SAMA post user_id "+ postUser_id + " || "+loggedInUser_id)    
            db.collection("posts").doc(postId).delete()
        } else{
            alert("Can't perform deleting post")
        }
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
                    <Avatar className="post__avatar" alt={username} src={photoUrl} />
                    
                    <h3>
                        <Link to={"/profile/"+postUser_id} className="post__headerUsername">
                            {username}
                        </Link> 
                    </h3>
                           
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
                    <MenuItem onClick={dotClose}>Visit Profile</MenuItem>
                    {(deletePostButton)()}
                </Menu>
            </div>

            {/* image */}
            <img className="post__image" src={imageUrl} alt=""/>
            {/* Likes and comment button */}
            <div className="post__action">
                <div className="post__actionSVG" onClick={submitLike}>
                    {likeSVG}
                </div>
                <div className="post__actionSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
            </div>
            <h4 className="post__text font-gray" onClick={()=>setModalLikeOpen(true)}>
                <strong>{likes.length} Likes</strong>
            </h4>
            {/* username + caption */}
            <h4 className="post__text font-gray">
                <Link to={"/profile/"+postUser_id} className="usernameLink">
                    <strong>{username}</strong> 
                </Link>
                {" "+caption}
            </h4>
            
            {/* COMMENT SECTION */}
            {comments.length!==0?(
                <>
                {comments.length>1?(
                    <p className="post__seeComment" onClick={()=>setModalCommentsOpen(true)}>
                        See other {comments.length-1} comments
                    </p>
                ):''}
                <p className="post__text font-gray">
                    <Link to={"/profile/"+comments[comments.length-1].user_id} className="usernameLink">
                        <strong>{comments[comments.length-1].username}</strong>
                    </Link>
                    {" "+comments[comments.length-1].comment.text}
                </p>
                </>
            ):''}
            
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
            {/* Post timestamp */}
            <p className="post__timestamp">{moment(timestamp.toDate().toString()).fromNow()}</p>
            
            {/* View All Comments Modal */}
            <Modal
                open={modalCommentsOpen}
                onClose={()=> setModalCommentsOpen(false)}
            >
                <div style={modalStyle} className="post__commentM">
                    <div className="post__commentTitle font-gray font-bold">
                        Comments
                    </div>
                    <div className="post_commentListContainer">
                        {/* username + caption */}
                        <div className="post__modalCaption">
                            <h4 className="post__text font-gray">
                                <Link to={"/profile/"+postUser_id} className="usernameLink">
                                    <strong>{username}</strong> 
                                </Link>
                                {" "+caption}
                                <p className="post__modalTimestamp">{moment(timestamp.toDate().toString()).fromNow()}</p>
                            </h4>
                        </div>
                        {/* Comment section */}
                        {comments.map(({id, comment,username, user_id})=>(
                            <h4 className="post__text font-gray" key={id}>
                                <Link to={"/profile/"+user_id} className="usernameLink">
                                    <strong>{username}</strong> 
                                </Link>
                                 {" "+comment.text}
                                 <p className="post__modalTimestamp">{moment(comment.timestamp.toDate().toString()).fromNow()}</p>
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
                </div>
            </Modal>

            {/* View Likes Modal */}
            <Modal
                open={modalLikeOpen}
                onClose={()=> setModalLikeOpen(false)}
            >
                <div style={modalStyle} className="post__like">
                    <div className="post__likeTitle font-gray font-bold">
                        Likes
                    </div>
                    <div className="post_likeListContainer">
                    {likes.map(like=>(
                        <div key={like.id } className="post__likeListItem">
                            <Avatar className="post__avatar" alt={like.username} src={like.photoUrl}/>
                            <Link to={"/profile/"+like.user_id} className="usernameLink">
                                <div className="font-gray font-bold">{like.username}</div>
                            </Link>
                        </div>
                    ))}
                    </div>
                </div>
            </Modal>

        </div>
    )
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
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default Post
