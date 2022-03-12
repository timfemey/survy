import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { db } from "./firebase";

const ViewPoll = () => {
  const [data, setData] = useState({});
  const [state, setState] = useState({ response: "Nothing" });
  const [list, setList] = useState([]);
  const [options, setOptions] = useState([]);
  const [key, setKey] = useState([]);

  let [vote_option, setVote] = useState("Initial State");
  let { poll } = useParams();

  let voted = false;
  const link = `http://localhost:5000/poll/${poll}`;
  let arr = [];
  let arr2 = [];

  let mounted = true;
  let toast = document.querySelector("#notif");
  let toast2 = document.querySelector("#notif2");

  const vote = () => {
    if (vote_option === "Initial State") {
      alert(`Choose an Option before Submitting Vote`);
      return false;
    }
    // eslint-disable-next-line no-undef
    let toaster = new bootstrap.Toast(toast);
    toaster.show();
    document.getElementById("votes").style.display = "block";

    const response = axios.request({
      method: "PUT",
      url: link,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        vote: vote_option,
      }),
    });
    response.then((data) => {
      setState({ response: data });

      // eslint-disable-next-line no-undef
      let toaster = new bootstrap.Toast(toast2);
      toaster.show();
    });
  };

  const pollData = async () => {
    let res = await axios.get(`${link}`);
    setData(res.data);
    let arr = [];
    for (const [key, value] of Object.entries(res.data.votes)) {
      arr.push(key);
    }
    setList(arr);
  };
  const load = () => {
    db.collection("polls")
      .where("id", "==", poll)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let x = doc.data().votes;
          for (const [key, value] of Object.entries(x)) {
            arr2.push(key);
            arr.push(value);
          }
        });
        setKey(arr2);
        setOptions(arr);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    if (mounted) {
      pollData()
        .then(() => {
          load();
        })
        .catch((err) => alert("Failed to Load Poll Data"));
    }

    return () => {
      mounted = false;
    };
  }, [voted]);

  return (
    <>
      <div className="card" style={{ width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title">Title: {data.title}</h3>
          <p className="card-text">Author: {data.author}</p>
        </div>
        <ul
          className="list-group list-group-flush"
          id="votes"
          style={{ display: "none" }}
        >
          {options.map((data, i) => {
            return (
              <li key={i} className="list-group-item">
                {key[i]}:{data.count} vote(s)
              </li>
            );
          })}
        </ul>
        <div className="card-body">
          {list.map((val, i) => {
            return (
              <>
                <div key={i} style={{ float: "none" }} className="form-check">
                  <input
                    className="form-check-input"
                    onClick={(e) => {
                      let others =
                        document.querySelectorAll(".form-check-input");
                      others.forEach((box) => (box.checked = false));

                      e.currentTarget.checked = true;
                      setVote(e.currentTarget.value);
                    }}
                    style={{ float: "none", paddingRight: "0", padding: "0" }}
                    type="checkbox"
                    value={val}
                    id={i}
                  />
                  <label
                    style={{ display: "inline" }}
                    className="form-check-label"
                    htmlFor={i}
                  >
                    {" "}
                    {val}
                  </label>
                </div>
              </>
            );
          })}
          {data?.author ? (
            <button
              type="button"
              onClick={() => vote()}
              className="btn btn-success"
            >
              Submit Vote
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: "11" }}
      >
        <div
          id="notif"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Adding Vote ;)</strong>
            <small>{new Date().toLocaleTimeString()}</small>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <p>Loading... {":)"} </p>
          </div>
        </div>
      </div>

      {/**When Vote is usccessfuly registered */}

      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: "11" }}
      >
        <div
          id="notif2"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Info {";)"}</strong>
            <small>{new Date().toLocaleTimeString()}</small>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <p>
              {state.response.data?.message} {":)"}{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ViewPoll);
