// const express = require('express');
import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";

import UserModel from "./models/user.model";

import CustomResponse from "./dtos/custom.response";

// invoke the express
const app = express();

// @ts-ignore
app.use(bodyParser.json());

interface User {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string
}

let users: User[] = [];



mongoose.connect("mongodb://localhost/blog")
const db = mongoose.connection

db.on('error', (error) => {
    console.log("DB Connection Error: ", error)
})

db.on('open', () => {
    console.log("DB Connected Successfully")
})


/**
 * Get all user
 */
app.get('/user/all', async (req: express.Request, res: express.Response) => {

    try {
        let users = await UserModel.find();
        res.status(200).send(
            new CustomResponse(200, "Users are found successfully", users)
        );
    } catch (error) {
        res.status(100).send("Error")
    }
})

/**
 * Create new user
 */
app.post('/user', async (req: express.Request, res: express.Response) => {
    try {
        const req_body: any = req.body;
        const userModel = new UserModel({
            username: req_body.username,
            fname: req_body.fname,
            lname: req_body.lname,
            email: req_body.email,
            password: req_body.password
        })
        let user = await userModel.save();
        user.password = "";
        res.status(200).send(
            new CustomResponse(200, "User created successfully", user)
        )
    } catch (error) {
        res.status(100).send("Error")
    }

})

/**
 * Auth
 */
app.post('/user/auth', async (req: express.Request, res: express.Response) => {
    try {

        let request_body = req.body
        // email, password

        let user = await UserModel.findOne({email: request_body.email});
        if(user) {
           if(user.password === request_body.password) {
               res.status(200).send(
                   new CustomResponse(200, "Access", user)
               );
           } else {
               res.status(401).send(
                   new CustomResponse(401, "Invalid credentials")
               );
           }
        } else {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            );
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})