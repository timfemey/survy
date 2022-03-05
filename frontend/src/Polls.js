import React from "react";
import "./Poll.css";
import PollComp from "./PollComp";
const Polls = () => {
  let takes = ["One Piece", "MHA", "Jojo", "Naruto"];
  return (
    <>
      <h2>Active Public Polls</h2>
      <div className="polls">
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
        <PollComp author="Hey" takes={takes} poll="What?" />
      </div>
    </>
  );
};

export default Polls;
