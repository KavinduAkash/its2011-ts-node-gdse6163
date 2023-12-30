// const express = require('express');
import express from 'express';

// invoke the express
const app = express();


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


// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})