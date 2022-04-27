import axios from "axios";
import React from "react";
import { useState } from "react";
import "./create-poll-style.css";

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

    const response = await axios.request({
      method: "POST",
      url: `https://survy-backend.herokuapp.com/polls`,
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
      // alert(data.message);
      let toast = document.getElementById("liveToast");
      // eslint-disable-next-line no-undef
      let toaster = new bootstrap.Toast(toast);
      toaster.show();
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
        <button
          className="btn btn-block btn-dark"
          id="create"
          type="submit"
          onClick={(e) => createPoll(e)}
        >
          Create Poll
        </button>
      </div>

      {data.id ? (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: "11" }}
        >
          <div
            id="liveToast"
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Poll Title: {data.title}</strong>
              <small>
                <b>Privacy: {privacy ? "Public" : "Private "}</b>
              </small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              <p>Poll Created Succesfully</p>
            </div>
            <div className="mt-2 pt-2 border-top">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard
                    .writeText("https://survy-ap.web.app/poll/" + data.id)
                    .then(() => alert("Copied!"));
                }}
                type="button"
                className="btn btn-primary btn-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default React.memo(CreatePoll);
