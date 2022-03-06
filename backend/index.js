var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { body, validationResult } from "express-validator";
import { v4 } from "uuid";
import { db, rdb, firebase } from "./firebase.js";
let app;
let port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app = express();
app.set("port", port);
app.set("env", node_env);
app.use(bodyParser.json());
app.use(cors());
if (!db) {
    console.error(`Firebase database not set or initialized`);
    process.exit(1);
}
app.post("/polls", body(`title`).isString(), body(`author`).isString(), body(`votes`).isArray({ min: 2, max: 4 }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Wrong Input Data", error: err.array() });
    }
    let data = {
        id: v4(),
        author: req.body.author,
        title: req.body.title,
        votes: req.body.votes.map((vote) => {
            return { name: vote, count: 0, id: v4() };
        }),
    };
    //Add Data to Database
    try {
        yield db.collection("polls").doc(data.id).set(data);
    }
    catch (err) {
        return res.json({ message: err });
    }
    //Server Response
    return res.json({
        message: "Poll Created",
        id: data.id,
        title: data.title,
    });
}));
app.put("/polls/:poll", body(`vote`).isString(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Wrong Input Data", error: err.array() });
    }
    const param = String((_a = req.params) === null || _a === void 0 ? void 0 : _a.poll).toString();
    function addVote(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ip == undefined)
                return false;
            try {
                db.collection("polls")
                    .doc(param)
                    .update({
                    "votes.count": firebase.firestore.FieldValue.increment(1),
                });
                res.json({ message: "Vote has been registered" });
            }
            catch (error) {
                return alert(`Invalid Poll Search/ID`);
            }
            let obj = {};
            obj["id"] = ip;
            let poll = rdb.ref(`${param}`);
            poll.set(obj);
        });
    }
    rdb.ref(`${param}`).on("value", (snapshot) => {
        const data = snapshot.val();
        const ip = req.socket.remoteAddress;
        if (data.id != ip && req.body.vote == "yes") {
            addVote(ip);
        }
        else {
            alert(`You have voted on this poll, Cant Vote Twice`);
            return false;
        }
    });
}));
//Invalid Page
app.get("*", (req, res, next) => {
    res.status(400).json({ message: "No Such Page, 404 Error" });
});
//Server running on Network Port
app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
//Start doing getPolls Feature in Nodejs
//Done with createVotes
