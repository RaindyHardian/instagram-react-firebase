import React,{useRef, useEffect, useState} from "react";
import {
    useHistory,
    useParams
} from "react-router-dom";
import { Avatar } from "@material-ui/core";

const Profile = (props) => {
    let { id } = useParams();
    const history = useHistory();
    const picRef = useRef(null);
    const [classPic, setClassPic] = useState({})

    useEffect(() => {
        if(picRef){
            setClassPic({
                height : picRef.current.offsetWidth+"px"
            })
        }
    }, [picRef.current]);

    const viewPost = ()=>{
        // history.push(`/p/sdafdasfje`)
    }
    return (
        <div className="profile">
            <div className="profile__head">
                <div className="font-bold font-gray">{props.user.displayName}</div>
            </div>
            <div className="profile__info">
                <div className="profile__infoA">
                    <Avatar className="profile__avatar" alt={props.user.displayName} src="/static/images/avatar/1.jpg" />
                    <div className="profile__infoAB">
                        <div className="font-bold">32</div>
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
                        Callum McWerner
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
                    <div className="profile__feedNavIconCont feedNavIcon_active">
                        <div className="profile__feedNavIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="profile__feedNavIconCont">
                        <div className="profile__feedNavIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="profile__feedGallery">
                    <div className="profile__feedGrid">
                        <div ref={picRef} className="profile__feedItem" style={classPic}>
                            <img  className="profile__feedPic" src="/img/contohimg.png" alt="" onClick={viewPost}/>
                        </div>
                        <div className="profile__feedItem">
                            <img className="profile__feedPic" src="/img/tali.png" alt=""/>
                        </div>
                        <div className="profile__feedItem">
                            <img className="profile__feedPic" src="/img/tali.png" alt=""/>
                        </div>
                        <div className="profile__feedItem">
                            <img className="profile__feedPic" src="/img/contohimg.png" alt=""/>
                        </div>
                        <div className="profile__feedItem">
                            <img className="profile__feedPic" src="/img/layar.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
