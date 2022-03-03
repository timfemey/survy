import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { body, validationResult } from "express-validator";
import { v4 } from "uuid";
import { db } from "./firebase.js";
let app: Express;
let port: number | string = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app = express();

app.set("port", port);
app.set("env", node_env);

app.use(bodyParser.json());
app.use(cors());

interface vote {
  name: string;
  count: number;
  id: string;
}

interface input {
  id: string;
  title: string;
  vote: vote;
}

if (db) {
  app.post(
    "/polls",
    body(`title`).isString(),
    body(`vote`).isArray({ max: 1 }),
    (req, res, next) => {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res
          .status(422)
          .json({ message: "Wrong Input Data", error: err.array() });
      }

      let data: input = {
        id: v4(),
        title: req.body.title,
        vote: req.body.votes.map((vote: string) => {
          return { name: vote, count: 0, id: v4() };
        }),
      };
      return res.json(data);
    }
  );

  //Invalid Page
  app.get("*", (req, res, next) => {
    res.status(400).json({ message: "No Such Page, 404 Error" });
  });
  //Server running on Network Port
  app.listen(port, (): void => {
    console.log(`Server running on localhost:${port}`);
  });
} else {
  console.error(`Firebase database not set or initialized`);
}