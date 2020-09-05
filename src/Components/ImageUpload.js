import React,{useState} from 'react'
import { CircularProgress, Button } from '@material-ui/core';
import firebase from "firebase"
import {db, storage} from '../firebase'
import moment from 'moment'

const ImageUpload = ({username, user_id}) => {
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState("");
    const [progress, setProgress] = useState(0);
    const [postLoading, setPostLoading] = useState(false)
    
    const handleChange = (e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
            setImageName(e.target.files[0].name+moment().format())
        }
    }
    const handleUpload = ()=>{
        setPostLoading(true)
        const uploadTask = storage.ref(`images/${imageName}`).put(image)

        uploadTask.on("state_changed", (snapshot)=>{
            // progress function
            const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(progress)
        }, (error)=>{
            // error function
            console.log(error)
            alert(error.message)
        }, ()=>{
            // complete function
            storage.ref("images").child(imageName).getDownloadURL().then(url=>{
                // post image to firestore db
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption, 
                    imageUrl : url,
                    user_id: db.doc('users/' + user_id),
                    // user_id : firebase.firestore.FieldValue.
                    // username: username
                })

                setProgress(0);
                setPostLoading(false)
                setCaption("");
                setImage(null);
            })
        })
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder="enter caption" value={caption} onChange={(e)=>setCaption(e.target.value)}/>
            <input type="file" onChange={handleChange}/>
            {!postLoading?(
                <Button onClick={handleUpload}>
                    Upload
                </Button>
            ):(<CircularProgress/>)}
            
        </div>
    )
}

export default ImageUpload
