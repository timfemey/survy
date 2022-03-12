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
import { v4 } from "uuid";
import { db, rdb, firebase } from "./firebase.js";
let app;
let port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app = express();
app.set("port", port);
app.set("env", node_env);
app.enable("trust proxy");
app.use(bodyParser.json());
app.use(cors({ origin: "https://survy-ap.web.app" }));
import rateLimit from "express-rate-limit";
const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(rateLimiter);
if (!db) {
    console.error(`Firebase database not set or initialized`);
    process.exit(1);
}
app.get("/poll/:poll", (req, res, next) => {
    var _a;
    let param = String((_a = req.params) === null || _a === void 0 ? void 0 : _a.poll).toString();
    db.collection("polls")
        .doc(param)
        .get()
        .then((doc) => {
        if (doc.exists) {
            let { author, title, votes } = doc.data();
            return res.json({ author: author, title: title, votes: votes });
        }
        else {
            res.json({ message: `Poll not Found` });
            return;
        }
    });
});
app.post("/polls", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Dynamic Object for Data in Firebase
    let obj = {};
    console.log(req.body);
    if (req.body.votes.length + 1 < 2)
        return res.json({ message: "Min: 2 Max:4 Options" });
    req.body.votes.map((vote) => {
        obj[`${vote}`] = { count: 0 };
    });
    let data = {
        id: v4(),
        author: String(req.body.author).toString(),
        title: String(req.body.title).toString(),
        votes: obj,
        privacy: req.body.privacy,
    };
    // Add Data to Database
    try {
        yield db.collection("polls").doc(data.id).set(data);
        return res.json({
            message: "Poll Created",
            id: data.id,
            title: data.title,
        });
    }
    catch (err) {
        return res.json({ message: err });
    }
    // Server Response
}));
app.put("/poll/:poll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const param = String((_a = req.params) === null || _a === void 0 ? void 0 : _a.poll).toString();
    const vote = String(req.body.vote).toString();
    function addVote(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let obj = {};
                obj[`votes.${vote}.count`] = firebase.firestore.FieldValue.increment(1);
                db.collection("polls").doc(param).update(obj);
                res.json({ message: "Vote has been registered" });
            }
            catch (error) {
                console.error(error);
                return res.json({ message: `Invalid Poll Search/ID` });
            }
            let obj = {};
            obj["id"] = ip;
            let poll = rdb.ref(`${param}`);
            poll.set(obj);
        });
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
        }
        else {
            res.json({ message: `You have voted on this poll before` });
            return false;
        }
    });
}));
process.on("uncaughtException", (err) => {
    console.log("Server Error Ocurred");
});
//Invalid Page
app.get("*", (req, res, next) => {
    res.status(400).json({ message: "No Such Page, 404 Error" });
});
//Server running on Network Port
app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
