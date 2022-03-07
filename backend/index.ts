import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { body, validationResult } from "express-validator";
import { v4 } from "uuid";
import { db, rdb, firebase } from "./firebase.js";
let app: Express;
let port: number | string = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app = express();

app.set("port", port);
app.set("env", node_env);

app.use(bodyParser.json());
app.use(cors());

import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 2 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);

interface input {
  id: string;
  author: string;
  title: string;
  votes: object;
}

if (!db) {
  console.error(`Firebase database not set or initialized`);
  process.exit(1);
}

app.get("/polls/:poll", (req, res, next) => {
  let param = String(req.params?.poll).toString();
  db.collection("polls")
    .doc(param)
    .get()
    .then((doc: any) => {
      if (doc.exists) {
        let { author, title, votes } = doc.data();
        res.json({ author: author, title: title, votes: votes });
      } else {
        res.json({ message: `Poll not Found` });
        return;
      }
    });
});

app.post(
  "/polls",
  body(`title`).isString(),
  body(`author`).isString(),
  body(`votes`).isArray({ min: 2, max: 4 }),
  async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Wrong Input Data", error: err.array() });
    }

    let obj = {};

    req.body.votes.map((vote: string) => {
      obj[`${vote}`] = { count: 0 };
    });

    let data: input = {
      id: v4(),
      author: req.body.author,
      title: req.body.title,
      votes: obj,
    };
    //Add Data to Database
    try {
      await db.collection("polls").doc(data.id).set(data);
    } catch (err) {
      return res.json({ message: err });
    }
    // Server Response
    return res.json({
      message: "Poll Created",
      id: data.id,
      title: data.title,
    });
  }
);

app.put("/polls/:poll", body(`vote`).isString(), async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Wrong Input Data", error: err.array() });
  }
  const param = String(req.params?.poll).toString();
  async function addVote(ip: string | undefined) {
    if (ip == undefined) return false;
    try {
      let obj = {};
      obj[`votes.${req.body.vote}.count`] =
        firebase.firestore.FieldValue.increment(1);
      db.collection("polls").doc(param).update(obj);
      res.json({ message: "Vote has been registered" });
    } catch (error) {
      console.error(error);
      return res.json({ message: `Invalid Poll Search/ID` });
    }
    let obj = {};
    obj["id"] = ip;
    let poll = rdb.ref(`${param}`);
    poll.set(obj);
  }

  rdb.ref(`${param}`).on("value", (snapshot) => {
    const data = snapshot.val();
    const ip = req.socket.remoteAddress;
    if (data.id != ip && req.body.vote == "yes") {
      addVote(ip);
    } else {
      res.json({ message: `You have voted on this poll, Cant Vote Twice` });
      return false;
    }
  });
});

//Invalid Page
app.get("*", (req, res, next) => {
  res.status(400).json({ message: "No Such Page, 404 Error" });
});
//Server running on Network Port
app.listen(port, (): void => {
  console.log(`Server running on localhost:${port}`);
});
