import React from "react";
import "./Poll.css";

const PollComp = ({ id, author, takes, poll }) => {
  let list = [];
  for (const [key, value] of Object.entries(takes)) {
    list.push(key);
  }

  return (
    <div
      onClick={() => window.open(`${window.location.href}poll/${id}`, "_blank")}
      className="indi_poll"
    >
      <h3>Author: {author}</h3>
      <p>{poll ? poll : "Loading..."} </p>
      <ol>
        {list.map((val, i) => {
          return (
            <>
              <li key={i}>{val}</li>
              <br />
            </>
          );
        })}
      </ol>
      <span>Click on card to see poll and vote</span>
    </div>
  );
};

export default PollComp;
