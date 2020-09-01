import React,{useRef, useEffect, useState} from "react";
import {
    useHistory,
    useParams
} from "react-router-dom";
import { Avatar } from "@material-ui/core";
import {db} from "../../firebase"
import Post from "../Post";

const Profile = (props) => {
    let { id } = useParams();
    const history = useHistory();
    const [profUser, setProfUser] = useState({})
    const [posts, setPosts] = useState([])
    const picRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);

    const [gridSectionClass, setGridSectionClass] = useState("profile__feedNavIconCont feedNavIcon_active")
    const [listSectionClass, setlistSectionClass] = useState("profile__feedNavIconCont")
    const [feedSection, setFeedSection] = useState(1)


    useEffect(()=>{
        // set posts
        let reference = db.collection("users").doc(id);
        reference.get().then(doc=>{
            setProfUser(doc.data())
        })
        db.collection('posts').where("user_id", "==", reference).onSnapshot( async snapshot=>{
            try{
                setPosts( await Promise.all(snapshot.docs.map( async doc=>{
                    let user = await doc.data().user_id.get()
                    setIsLoading(false)
                    return {
                        id : doc.id,
                        post : doc.data(),
                        username : user.data().displayName,
                        user_id : user.id
                    }
                })))
            } catch (err){
                console.log(err)
            }
        })
    },[])
    const changeSection = (e)=>{
        if(e.target.attributes.name.value==="grid"){
            setGridSectionClass("profile__feedNavIconCont feedNavIcon_active")
            setlistSectionClass("profile__feedNavIconCont")
            setFeedSection(1)
        } else {
            setGridSectionClass("profile__feedNavIconCont ")
            setlistSectionClass("profile__feedNavIconCont feedNavIcon_active")
            setFeedSection(2)
        }
    }
    const viewPost = (e)=>{
        history.push(`/p/`+e.target.attributes.postid.value)
    }
    return (
        <div className="profile">
            <div className="profile__head">
                <div className="font-bold font-gray">{profUser.displayName}</div>
            </div>
            <div className="profile__info">
                <div className="profile__infoA">
                    <Avatar className="profile__avatar" alt={profUser.displayName} src="/static/images/avatar/1.jpg" />
                    <div className="profile__infoAB">
                        <div className="font-bold">{posts.length}</div>
                        <div>Post</div>
                    </div>
                    <div className="profile__infoAB">
                        <div className="font-bold">295</div>
                        <div>Followers</div>
                    </div>
                    <div className="profile__infoAB">
                        <div className="font-bold">264</div>
                        <div>Following</div>
                    </div>
                </div>
                <div className="profile__infoB">
                    <div className="profile__name font-bold">
                        {profUser.displayName}
                    </div>
                    <div className="profile__bio">
                        Charming code writer and cooking enthusiast
                    </div>
                    <div className="profile__editBtnCont">
                        <button className="profile__editBtn">Edit Profile</button>
                    </div>
                </div>
            </div>
            <div className="profile__feed">
                <div className="profile__feedNav">
                    <div className={gridSectionClass} name="grid" onClick={changeSection}>
                        <div className="profile__feedNavIcon" name="grid">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" name="grid">
                            <path name="grid" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className={listSectionClass} name="list" onClick={changeSection}>
                        <div className="profile__feedNavIcon" name="list"> 
                            <svg name="list" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path name="list" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="profile__feedGallery">
                    {feedSection===1?(
                        <div className="profile__feedGrid">
                            {posts.map(({id, post, user_id, username},index)=>(
                                <div key={id} ref={picRef} name="feedPic" className="profile__feedItem" style={{height : picRef.current?picRef.current.offsetWidth+"px":'unset'}}>
                                    <img  className="profile__feedPic" src={post.imageUrl} alt="" onClick={viewPost} postid={id}/>
                                </div>
                            ))}
                        </div>
                    ):(
                        <div>
                            {posts.map(({id, post, username, user_id})=>(
                                <Post key={id} postId={id} username={username} caption={post.caption} imageUrl={post.imageUrl} postUser_id={user_id} isLoggedIn={props.isLoggedIn} loggedInUser_id={props.isLoggedIn?props.user.uid:''}/>
                            ))}  
                        </div>
                    )}
                    
                       
                </div>
            </div>
        </div>
    )
}

export default Profile
