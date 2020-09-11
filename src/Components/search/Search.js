import React, { useState, useEffect } from "react";import {
  useHistory
} from "react-router-dom";
import { Avatar } from "@material-ui/core";
import {db} from "../../firebase"

const Search = () => {
  const history = useHistory();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState([]);
  useEffect(() => {
    db.collection("users").where("displayName", "==", input).get().then(snap=>{
      snap.docs.map(doc=>console.log(doc.data()))
      setSearch(snap.docs.map(doc=>{
        return {
          id : doc.id,
          data : doc.data()
        }
      }))
    })
    // const s = async ()=>{
    //   let node = await db.reference('/users').orderByChild(input).startAt('!').endAt('SUBSTRING\uf8ff').once('value');
    // }
    // s()
  }, [input]);
  const visitProfile = (e)=>{
    history.push('/profile/'+e.target.attributes.user_id.value)
  }
  return (
    <div className="search">
      {/* SEARCH BAR */}
      <form className="search__form">
        <input
          className="search__input"
          type="text"
          placeholder="Enter username to search"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </form>
      {/* BODY */}
      <div className="search__result">
        {search.length===0?(
          <center>
            <div className="search__noresult">No Result</div>
          </center>
        ):(
          search.map(({id,data})=>(
            <div className="search__item" key={id} user_id={id} onClick={visitProfile}>
              <Avatar className="search__avatar" src={data.photoUrl}/>
              <div>{data.displayName}</div>
            </div>
          ))
        )}
        
        {/* <div className="search__item">
          <Avatar className="search__avatar" />
          <div>leomessi</div>
        </div>
        <div className="search__item">
          <Avatar className="search__avatar" />
          <div>kaihavertz</div>
        </div>
        <div className="search__item">
          <Avatar className="search__avatar" />
          <div>komengreal</div>
        </div> */}
      </div>
    </div>
  );
};

export default Search;
