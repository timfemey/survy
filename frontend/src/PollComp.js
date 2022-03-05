import React from "react";
import "./Poll.css";

const PollComp = ({ author, takes, poll }) => {
  let arr = takes;
  let list = arr.map((take, i) => {
    return (
      <>
        <li key={i}>{take}</li>
        <br />
      </>
    );
  });
  return (
    <div className="indi_poll">
      <h3>Author: {author}</h3>
      <p>{poll} </p>
      <ol>{list}</ol>
      <span>Click on card to see poll and vote</span>
    </div>
  );
};

export default PollComp;
