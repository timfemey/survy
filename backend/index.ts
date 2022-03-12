import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { v4 } from "uuid";
import { db, rdb, firebase } from "./firebase.js";
let app: Express;
let port: number | string = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app = express();

app.set("port", port);
app.set("env", node_env);
app.enable("trust proxy");

app.use(bodyParser.json());
app.use(cors({ origin: "https://survy-ap.web.app" }));

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
  privacy: boolean;
}

if (!db) {
  console.error(`Firebase database not set or initialized`);
  process.exit(1);
}

app.get("/poll/:poll", (req, res, next) => {
  let param = String(req.params?.poll).toString();
  db.collection("polls")
    .doc(param)
    .get()
    .then((doc: any) => {
      if (doc.exists) {
        let { author, title, votes } = doc.data();
        return res.json({ author: author, title: title, votes: votes });
      } else {
        res.json({ message: `Poll not Found` });
        return;
      }
    });
});

app.post("/polls", async (req, res, next) => {
  //Dynamic Object for Data in Firebase
  let obj = {};
  console.log(req.body);
  if (req.body.votes.length + 1 < 2)
    return res.json({ message: "Min: 2 Max:4 Options" });

  req.body.votes.map((vote: string) => {
    obj[`${vote}`] = { count: 0 };
  });

  let data: input = {
    id: v4(),
    author: String(req.body.author).toString(),
    title: String(req.body.title).toString(),
    votes: obj,
    privacy: req.body.privacy,
  };
  // Add Data to Database
  try {
    await db.collection("polls").doc(data.id).set(data);
    return res.json({
      message: "Poll Created",
      id: data.id,
      title: data.title,
    });
  } catch (err) {
    return res.json({ message: err });
  }
  // Server Response
});

app.put("/poll/:poll", async (req, res, next) => {
  const param = String(req.params?.poll).toString();
  const vote = String(req.body.vote).toString();
  async function addVote(ip: string | undefined) {
    try {
      let obj = {};
      obj[`votes.${vote}.count`] = firebase.firestore.FieldValue.increment(1);
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

  rdb
    .ref(`${param}`)
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(param, data);
      const ip = req.ip;
      if (data == null) {
        addVote(ip);
      } else {
        res.json({ message: `You have voted on this poll before` });
        return false;
      }
    });
});

process.on("uncaughtException", (err) => {
  console.log("Server Error Ocurred");
});

//Invalid Page
app.get("*", (req, res, next) => {
  res.status(400).json({ message: "No Such Page, 404 Error" });
});

//Server running on Network Port
app.listen(port, (): void => {
  console.log(`Server running on localhost:${port}`);
});
