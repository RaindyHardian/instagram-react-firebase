import React,{useState} from 'react'
import {
    useHistory
} from "react-router-dom";
import { CircularProgress, Button, TextField } from '@material-ui/core';
import firebase from "firebase"
import {db, storage} from '../firebase'
import moment from 'moment'

const ImageUpload = ({username, user_id}) => {
    const history = useHistory()
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [progress, setProgress] = useState(0);
    const [postLoading, setPostLoading] = useState(false)
    
    const handleChange = (e)=>{
        if(e.target.files[0]){
            if(e.target.files[0].type==="image/jpeg" || e.target.files[0].type==="image/png"){
                var imageReader = new FileReader();
                imageReader.readAsDataURL(e.target.files[0]);
                imageReader.onload = function (oFREvent) {
                    setImagePreview(oFREvent.target.result)
                };
                setImage(e.target.files[0])
                setImageName(e.target.files[0].name+moment().format())
            } else{
                alert("Please choose an image")
            }
        }
    }
    const handleUpload = ()=>{
        if(image !== null && imageName !== "" && caption!== ""){
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
                    history.push("/")
                })
            })
        }
    }

    return (
        <div className="imageupload">
            <img 
                className="imageUpload__preview"
                src={imagePreview}
                alt=""
            />
            <progress className="imageupload__progress" value={progress} max="100"/>
            
            <input type="file" className="imageupload__file" onChange={handleChange}/>
            <TextField
                className="imageupload__input"
                id="standard-multiline-flexible"
                label="Caption"
                multiline
                rowsMax={4}
                value={caption}
                onChange={(e)=>setCaption(e.target.value)}
            />
            {!postLoading?(
                <Button variant="contained" color="default" onClick={handleUpload} className="imageupload__button">
                    Upload
                </Button>
            ):(<CircularProgress/>)}
            
        </div>
    )
}

export default ImageUpload
