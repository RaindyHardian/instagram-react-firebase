import React,{useState, useEffect, useRef} from 'react'
import {
    useHistory
} from "react-router-dom";
import { Avatar, TextField, CircularProgress } from '@material-ui/core';
import firebase from "firebase"
import {db, storage} from "../../firebase"
import moment from 'moment'

const EditProfile = (props) => {
    const history = useHistory()
    const [displayName, setDisplayName] = useState("")
    const [fullName, setFullName] = useState("")
    const [bio, setBio] = useState("")
    const [photoUrl, setPhotoUrl] = useState(null)
    const [imageUpload, setImageUpload] = useState(null)
    const [imageUploadName, setImageUploadName] = useState("")
    const openDialogRef = useRef(null)

    const [isLoading, setIsLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(()=>{
        if(props.user.uid){
            db.collection("users").doc(props.user.uid).get().then(doc=>{
                setDisplayName(doc.data().displayName)
                setFullName(doc.data().fullName)
                setBio(doc.data().bio)
                setPhotoUrl(doc.data().photoUrl)
                setIsLoading(false)
            })
        }
    },[props.user.uid])

    const handleImage = (e)=>{
        if(e.target.files[0]){
            var imageReader = new FileReader();
            imageReader.readAsDataURL(e.target.files[0]);
            imageReader.onload = function (oFREvent) {
                setPhotoUrl(oFREvent.target.result)
            };
            setImageUpload(e.target.files[0])
            setImageUploadName(e.target.files[0].name+moment().format())
        }
    }
    
    const submitProfile = ()=>{
        setSubmitLoading(true)
        if(imageUpload!== null){
            const uploadTask = storage.ref(`images/${imageUploadName}`).put(imageUpload)
            uploadTask.on("state_changed", (snapshot)=>{},(error)=>{
                // error function
                console.log(error)
                alert(error.message)
            }, ()=>{
                storage.ref("images").child(imageUploadName).getDownloadURL().then(url=>{
                    var userProfile = firebase.auth().currentUser;
                    userProfile.updateProfile({
                        photoURL: url
                    }).then(function() {
                        // Update successful.
                        db.collection("users").doc(props.user.uid).set({
                            displayName: displayName,
                            fullName : fullName,
                            bio : bio,
                            photoUrl : url
                        }).then(()=>{
                            setSubmitLoading(false)
                        }).catch(err=>{
                            console.log(err)
                            setSubmitLoading(false)
                        })
                    }).catch(function(error) {
                        // An error happened.
                    });
                })
            })
        } else{
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
                    <Avatar className="editProfile__avatar" alt={displayName} src={photoUrl} />
                    <div className="editProfile__changepic" onClick={()=>openDialogRef.current.click()}>
                        Change Profile Picture
                    </div>
                    
                    <input ref={openDialogRef} type="file" onChange={handleImage} style={{display: 'none'}}/>

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
                        defaultValue={props.user.email}
                    />
                </div>
            </div>
        </div>
    )
}

export default EditProfile
