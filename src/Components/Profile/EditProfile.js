import React,{useState, useEffect, useRef} from 'react'
import {
    useHistory
} from "react-router-dom";
import { Avatar, TextField, CircularProgress } from '@material-ui/core';
import firebase from "firebase"
import {db, storage} from "../../firebase"

const EditProfile = (props) => {
    const history = useHistory()
    const [displayName, setDisplayName] = useState("")
    const [fullName, setFullName] = useState("")
    const [bio, setBio] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const openDialogRef = useRef(null)

    const [isLoading, setIsLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(()=>{
        if(props.user.uid){
            db.collection("users").doc(props.user.uid).get().then(doc=>{
                setDisplayName(doc.data().displayName)
                setFullName(doc.data().fullName)
                setBio(doc.data().bio)
                setAvatarUrl(doc.data().avatarUrl)
                setIsLoading(false)
            })
        }
    },[props.user.uid])
    
    const submitProfile = ()=>{
        setSubmitLoading(true)
        db.collection("users").doc(props.user.uid).set({
            displayName: displayName,
            fullName : fullName,
            bio : bio
        }).then(()=>{
            setSubmitLoading(false)
        }).catch(err=>{
            console.log(err)
            setSubmitLoading(false)
        })
    }

    const backToProfile = ()=>{
        history.push(`/profile/${props.user.uid}`)
    }

    return isLoading?'':(
        <div className="editProfile">
            <div className="editProfile__header">
                <div className="editProfile__headerLeft">
                    <div className="editProfile__action" onClick={backToProfile}> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="editProfile__title">
                        Edit Profile
                    </div>
                </div>
                {submitLoading?(
                    <CircularProgress className="editProfile__action"/>
                ):(
                    <div className="editProfile__action" onClick={submitProfile}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
            <div >
                <form className="editProfile__form">
                    <Avatar className="editProfile__avatar" alt={displayName} src="/static/images/avatar/1.jpg" />
                    <div className="editProfile__changepic" onClick={()=>openDialogRef.current.click()}>
                        Change Profile Picture
                    </div>
                    
                    <input ref={openDialogRef} type="file" style={{display: 'none'}}/>

                    <TextField className="editProfile__input" id="standard-basic" label="Name" value={fullName} onChange={(e)=>setFullName(e.target.value)}/>

                    <TextField className="editProfile__input" id="standard-basic" label="Username" value={displayName} onChange={(e)=>setDisplayName(e.target.value)}/>

                    <TextField
                        className="editProfile__input"
                        id="standard-multiline-flexible"
                        label="Bio"
                        multiline
                        rowsMax={4}
                        value={bio}
                        onChange={(e)=>setBio(e.target.value)}
                    />                
                </form>

                <div className="editProfile__info">
                    <div className="editProfile__infoTitle">Profile Information</div>
                    <TextField
                        disabled
                        id="standard-disabled"
                        label="Email Address"
                        defaultValue="blabla@gmail.com"
                    />
                </div>
            </div>
        </div>
    )
}

export default EditProfile
