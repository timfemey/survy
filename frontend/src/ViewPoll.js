import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewPoll = () => {
  const [data, setData] = useState({});
  const [list, setList] = useState([]);
  let [vote_option, setVote] = useState("");
  let { poll } = useParams();

  let voted = false;
  const link = `http://localhost:5000/poll/${poll}`;

  let mounted = true;

  const pollData = async () => {
    let res = await axios.get(`${link}`);
    setData(res.data);
    let arr = [];
    for (const [key, value] of Object.entries(res.data.votes)) {
      arr.push(key);
    }
    setList(arr);
  };
  const vote = async () => {
    const response = await axios.request({
      method: "PUT",
      url: `${link}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        vote: vote_option,
      }),
    });
  };
  useEffect(() => {
    if (mounted) {
      pollData();
    }

    return () => {
      mounted = false;
    };
  }, [voted]);

  return (
    <>
      <h1>{data.title}</h1>
      <h3>{data.author}</h3>
      <ul>
        {list.map((val, i) => {
          return <li key={i}>{val}</li>;
        })}
      </ul>
    </>
  );
};

export default ViewPoll;
