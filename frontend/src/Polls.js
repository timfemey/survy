import React, { useState, useEffect } from "react";
import "./Poll.css";
import PollComp from "./PollComp";
import { db } from "./firebase";
const Polls = () => {
  const [options, setOptions] = useState([]);
  let arr = [];
  let open = false;
  let mounted = true;
  const load = () => {
    db.collection("polls")
      .where("privacy", "==", true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        setOptions(arr);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  useEffect(() => {
    if (mounted) load();

    return () => {
      mounted = false;
    };
  }, [open]);

  return (
    <>
      <h2>Active Public Polls</h2>
      <div className="polls">
        {options ? (
          options.map((obj, i) => {
            return (
              <PollComp
                key={i}
                author={obj.author}
                poll={obj.title}
                id={obj.id}
                takes={obj.votes}
              />
            );
          })
        ) : (
          <h3>Not Available, Failure to Load Data</h3>
        )}
      </div>
    </>
  );
};

export default Polls;
