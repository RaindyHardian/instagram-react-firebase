import React, {useState} from 'react'
import {
    Link
} from "react-router-dom";
import { Avatar } from '@material-ui/core';

const BottomNav = (props) => {
    let username = props.user.displayName || "";
    let loggedInUser_id;
    if(props.isLoggedIn){
        loggedInUser_id = props.user.uid;
    }
    
    return (
        <div className="BottomNav">
            <div className="BottomNav__container">
                <div className="BottomNav__divSVG">
                    {/* HOME */}
                    <Link to="/" className="BottomNav__link" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>
                </div>
                <div className="BottomNav__divSVG">
                    {/* SEARCH */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="BottomNav__divSVG">
                    {/* ADD/UPLOAD */}
                    <Link to="/upload" className="BottomNav__link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Link>
                </div>
                <div className="BottomNav__divSVG">
                    {/* LOVE/ACTIVITY */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div className="BottomNav__divSVG">
                    {/* PROFILE */}
                    <Link to={"/profile/"+loggedInUser_id} className="BottomNav__link">
                        <Avatar className="BottomNav__profile" alt={username} src="/static/images/avatar/1.jpg" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BottomNav
