import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { db } from "../../firebase";

const Activity = (props) => {
  const [acts, setActs] = useState([]);
  useEffect(() => {
    db.collection(`users/${props.user_id}/activity`)
      .orderBy("timestamp", "desc")
      .onSnapshot(async (snapshot) => {
        try {
          setActs(
            await Promise.all(
              snapshot.docs.map(async (doc) => {
                let user = await doc.data().user_id.get();
                let post = await db
                  .collection("posts")
                  .doc(doc.data().postId)
                  .get();
                return {
                  id: doc.id,
                  act: doc.data(),
                  username: user.data().displayName,
                  user_id: user.id,
                  photoUrl: user.data().photoUrl,
                  imageUrl: post.data().imageUrl,
                };
              })
            )
          );
        } catch (err) {
          console.log(err);
        }
      });
    // return () => {
    //   unsubscribePosts();
    // };
  }, [props.user_id, props.isLoggedIn]);
  return (
    <div className="activity">
      <div>
        <div className="activity__header">Activity</div>
        <div className="activity__content">
          {acts.map(({ id, act, username, user_id, photoUrl, imageUrl }) => (
            <div key={id} className="activity__item">
              <div className="activity__left">
                <Avatar className="activity__avatar" alt="" src={photoUrl} />
                <div className="activity__description">
                  <strong>{username}</strong>
                  {(() => {
                    if (act.type == "like") {
                      return " has liked your post";
                    } else if (act.type == "comment") {
                      return " has commented on your post";
                    }
                  })()}
                </div>
              </div>
              <img className="activity__preview" src={imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;
