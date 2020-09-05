import React, {useState, useEffect} from 'react'
import {
    useHistory,
    useParams,
    Link
} from "react-router-dom";
import { Avatar, Modal, CircularProgress, Menu, MenuItem } from "@material-ui/core";
import firebase from 'firebase'
import {db} from "../../firebase"
import moment from "moment"

const SinglePost = (props) => {
    let { id } = useParams();
    const history = useHistory();
    const [post, setPost] = useState({})
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState("");
    const [postLoading, setPostLoading] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true)
    const [modalStyle] = useState(getModalStyle);
    const [modalLikeOpen, setModalLikeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    const [likeSVG,setLikeSVG] = useState((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>))
    const deletePostButton = ()=>{
        if(post.user_id == props.user.uid){
            return <MenuItem onClick={deletePost}>Delete Post</MenuItem>
        }else{
            return ''
        }
    }

    useEffect(() => {
        // set post
        var unsubscribePosts = db.collection("posts").doc(id).onSnapshot( async doc=>{
            // console.log(snapshot.data())
            let user = await doc.data().user_id.get()
            setPost({
                id : doc.id,
                post : doc.data(),
                username : user.data().displayName,
                user_id : user.id,
                photoUrl : user.data().photoUrl
            })
            setIsLoading(false)
        })

        // set comments
        var unsubscribeComments = db.collection("posts").doc(id).collection("comments").orderBy('timestamp', 'asc').onSnapshot( async snapshot=>{
            setComments(await Promise.all(snapshot.docs.map(async doc=>{
                let user = await doc.data().user_id.get()
                return {
                    id : doc.id,
                    comment : doc.data(),
                    username : user.data().displayName,
                    user_id : user.id
                }
            })))
        })
        // set likes
        var unsubscribeLikes = db.collection("posts").doc(id).collection("likes").onSnapshot(async snapshot=>{
            setLikes(await Promise.all(snapshot.docs.map(async doc=>{
                let user = await doc.data().user_id.get()
                return {
                    id: doc.id,
                    username : user.data().displayName 
                }
            })))
        })
        return ()=>{
            unsubscribePosts()
            unsubscribeComments()
            unsubscribeLikes()
        }
    }, [])

    useEffect(()=>{
        likes.map(like=>{
            if(like.id===props.user.uid){
                setLikeSVG((<svg style={{color:'#ed4956'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>))
            } else{
                setLikeSVG((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>))
            }
        })
    },[likes, props.isLoggedIn])

    const postComment = ()=>{
        setPostLoading(true)
        db.collection(`posts/${id}/comments`).add({
            text: inputComment,
            user_id: db.doc('users/' + props.user.uid),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(()=>{
            setInputComment('')
            setPostLoading(false)
        }).catch(err=>{
            setPostLoading(false)
        })
    }

    const submitLike = ()=>{
        if(!props.isLoggedIn){
            return alert("Please login to like a post")
        } else{
            if(likes.length!=0){
                likes.map(like=>{
                    if(like.id==props.user.uid){
                        db.collection(`posts/${id}/likes`).doc(props.user.uid).delete().then(()=>{
                            setLikeSVG((<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>))
                        })
                    } else{
                        db.collection(`posts/${id}/likes`).doc(props.user.uid).set({
                            user_id: db.doc('users/' + props.user.uid),
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        }).then(()=>{
                            setLikeSVG((<svg style={{color:'#ed4956'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>))
                        })
                    }
                })
            }else{
                db.collection(`posts/${id}/likes`).doc(props.user.uid).set({
                    user_id: db.doc('users/' + props.user.uid),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
            }
        }
    }

    const deletePost = ()=>{
        if(post.user_id === props.user.uid){
            // alert("SAMA post user_id "+ postUser_id + " || "+loggedInUser_id)    
            db.collection("posts").doc(post.id).delete()
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
        <div className="singlePost">
            <div className="post__header">
                <div className="post__profile">
                    <Avatar className="post__avatar" alt={post.username} src={post.photoUrl} />
                    
                    <h3>
                        <Link to={"/profile/"+post.user_id} className="post__headerUsername">
                            {post.username}
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
            {!isLoading?<img className="post__image" src={post.post.imageUrl} alt=""/>:''}
            
            
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
            <h4 className="post__text font-gray" onClick={()=>setModalLikeOpen(true)}><strong>{likes.length} Likes</strong></h4>
            {/* username + caption */}
            {!isLoading?(
                <>
                <h4 className="post__text font-gray"><strong>{post.username}</strong> {post.post.caption}</h4>
                {/* Post timestamp */}
                <p className="post__timestamp">{moment(post.post.timestamp.toDate().toString()).fromNow()}</p>
                </>
            ):''}
            
            {/* Comment section */}
            {comments.map(({id, comment,username})=>(
                <h4 className="post__text font-gray" key={id}>
                    <strong>{username}</strong> {comment.text}
                    {/* Post timestamp */}
                    <p className="post__modalTimestamp">{moment(comment.timestamp.toDate().toString()).fromNow()}</p>
                </h4>
            ))}
            {props.isLoggedIn?(
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
                            <Avatar className="post__avatar" alt={like.username} src="/static/images/avatar/1.jpg" />
                            <div className="font-gray font-bold">{like.username}</div>
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
export default SinglePost
