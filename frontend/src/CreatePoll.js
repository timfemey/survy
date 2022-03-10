import axios from "axios";
import React from "react";
import { useState } from "react";
import "./create-poll-style.css";
import { Link } from "react-router-dom";

let i = 1;

let optionCount = [1];

const CreatePoll = () => {
  const [pollinfo, setPollInfo] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [data, setData] = useState({});
  const [privacy, setPrivacy] = useState(true);

  async function createPoll(e) {
    if (pollinfo.length + 1 < 2) {
      alert(`Min: 2 Max:4, Read No. of Options Allowed in Poll`);
      return false;
    }
    if (!title && author) return alert("Set Poll Info :)");
    alert("Loading... ;)");

    e.preventDefault();

    const response = await axios.request({
      method: "POST",
      url: `http://localhost:5000/polls`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        title: title,
        author: author,
        votes: pollinfo,
        privacy: privacy,
      }),
    });

    if (response.status !== 200) {
      alert("Unable to Create Poll");
      return false;
    } else {
      setData(response.data);
      alert(data.message);
    }
  }

  const addOption = () => {
    if (optionCount.length === 4) {
      alert(`Max Options Limit Reached ${parseInt(optionCount.length)}`);
      return false;
    }
    optionCount.push(i++);
    setData({ message: "Done" });
  };
  const removeOption = ({ target }) => {
    if (optionCount.length <= 1) {
      alert("Create more than One option before delete");
      return false;
    }
    let arr = [...pollinfo];
    let index = arr.indexOf(target.value);
    optionCount.pop();
    arr.splice(index, 1);
    setPollInfo([...arr]);
  };
  const check = (e, i) => {
    if (pollinfo[i] === e.target.value && pollinfo[i]) {
      return false;
    } else {
      let arr = [...pollinfo];
      let index = arr.indexOf(e.target.value);
      if (index > -1) {
        arr.splice(index, 1);
        setPollInfo([...arr]);
        return;
      }
      setPollInfo([...pollinfo, e.target.value]);
    }
  };

  return (
    <>
      {data.id ? (
        <>
          <h3>Poll created Successfully</h3>
          <p>
            Title: {data.title}
            <br />
            Privacy:{" "}
            {privacy
              ? "Public Poll, shown in home page and Link too"
              : "Private Poll, Only People with Link Can See and Vote"}
            <br />
            Link:{" "}
            <Link to={"http://localhost:3000/poll/" + data.id}>
              <a href={"http://localhost:3000/poll/" + data.id} target="_blank">
                {"http://localhost:3000/poll/" + data.id}
              </a>
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1>Create Poll</h1>

          <div id="body">
            <label for="title">Poll Name:</label>
            <input
              id="title"
              type="text"
              onBlur={(e) => {
                setTitle(e.currentTarget.value);
              }}
              placeholder="Title"
              name="title"
              required
            />
            <br />
            <label for="author">Author Name:</label>
            <input
              id="author"
              onBlur={(e) => {
                setAuthor(e.currentTarget.value);
              }}
              type="text"
              name="author"
              placeholder="Author Name"
              required
            />

            <br />
            <label for="privacy">Privacy Setting:</label>
            <button
              name="privacy"
              style={{ fontSize: "14px" }}
              onClick={(e) => {
                e.preventDefault();
                setPrivacy(!privacy);
              }}
            >
              Privacy: {privacy ? "Public " : "Private"}
            </button>
            <br />
            {optionCount.map((val, i) => {
              return (
                <>
                  <label for={i}>Vote Opt {i + 1}:</label>
                  <input
                    key={i}
                    onBlur={(e, i) => check(e, i)}
                    onDoubleClick={(e) => removeOption(e)}
                    type="text"
                    name={i}
                    placeholder="Double Click to delete "
                    required
                  />
                  <button key={i} onClick={() => addOption()}>
                    +
                  </button>
                  <br />
                </>
              );
            })}

            <br />
            <button id="create" type="submit" onClick={(e) => createPoll(e)}>
              Create Poll
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CreatePoll;
