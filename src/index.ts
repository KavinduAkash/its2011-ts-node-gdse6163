// const express = require('express');
import express from 'express';
import bodyParser from "body-parser";

// invoke the express
const app = express();

// @ts-ignore
app.use(bodyParser.json());

/**
 * Get all user
 */
app.get('/user/all', (req: express.Request, res: express.Response) => {

    let data = {
        _id: "asdasdasdasdasda",
        username: "pathums",
        fname: "Pathum",
        lname: "Silva",
        email: "pathums@ijse.lk"
    }

    res.send(data);
})

/**
 * Create new user
 */
app.post('/user', (req: express.Request, res: express.Response) => {

    const req_body: any = req.body;
    console.log(req_body);

    res.send("OK!");
})


// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})