import dotenv from 'dotenv';
dotenv.config();

// const express = require('express');
import express from 'express';
import bodyParser from "body-parser";
import mongoose, {Schema} from "mongoose";
import {ObjectId} from "mongodb";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';

import UserModel from "./models/user.model";
import ArticleModel from "./models/article.model";
import * as SchemaTypes from "./types/SchemaTypes";

import CustomResponse from "./dtos/custom.response";

import UserRoutes from "./routes/user.routes";

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

mongoose.connect(process.env.MONGO_URL as string)
const db = mongoose.connection

db.on('error', (error) => {
    console.log("DB Connection Error: ", error)
})

db.on('open', () => {
    console.log("DB Connected Successfully")
})

// ----------------- user -------------------

app.use('/user', UserRoutes)

// ----------------- article -------------------

const verifyToken = (req: express.Request, res: any, next: express.NextFunction) => {

    const token = req.headers.authorization;
    // verify the token

    if(!token) {
        return res.status(401).json('Invalid token')
    }

    try {
        const data = jwt.verify(token, process.env.SECRET as Secret);
        res.tokenData = data;
        next();
    } catch (error) {
        return res.status(401).json('Invalid token')
    }
}

app.post('/article', verifyToken, async (req: express.Request, res: any) => {

    try {

        let req_body = req.body;

        let user_id = res.tokenData.user._id;

        console.log(req_body)

        let articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(user_id)
        });

        await articleModel.save().then(r => {
            res.status(200).send(
                new CustomResponse(200, "Article created successfully.")
            )
        }).catch(e => {
            console.log(e)
            res.status(100).send(
                new CustomResponse(100, "Something went wrongs")
            )
        });

    } catch (error) {
        res.status(100).send("Error");
    }
});

app.get('/article', async (req: express.Request, res: express.Response) => {
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let articles = await ArticleModel.find().limit(size).skip(size * (page - 1));

        let documentCount = await ArticleModel.countDocuments();
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", articles, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
})

app.get('/article/:username', async (req: express.Request, res: express.Response) =>{
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let username: string = req.params.username;

        let user:any = await UserModel.findOne({username: username});

        if(!user) {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            )
        } else {
            let articles = await ArticleModel.find({user: user._id}).limit(size).skip(size * (page - 1))

            let documentCount = await ArticleModel.countDocuments({user: user._id});
            let pageCount = Math.ceil(documentCount/size);

            res.status(200).send(
                new CustomResponse(200, "Articles are found successfully", articles, pageCount)
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

app.get('/article/get/my', verifyToken, async (req: express.Request, res: any) => {
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let user_id = res.tokenData.user._id;

        let articles = await ArticleModel.find({user:user_id}).limit(size).skip(size * (page - 1))

        let documentCount = await ArticleModel.countDocuments({user: user_id});
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", articles, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
})

app.put('/article', verifyToken, async (req: express.Request, res: any) => {
    try {

        let req_body: any = req.body

        let user_id = res.tokenData.user._id;

        let article = await ArticleModel.find({_id: req_body.id ,user: user_id})

        console.log('test');

        if(article) {

            await ArticleModel.findOneAndUpdate({_id: req_body.id}, {
                title: req_body.title,
                description: req_body.description
            })
            .then(r => {
                res.status(200).send(
                    new CustomResponse(100, "Article updated successfully.")
                )
            }).catch(error => {
                    console.log(error)
                    res.status(100).send(
                        new CustomResponse(100, "Something went wrong.")
                    )
            })

        } else {
            res.stat(401).send(
                new CustomResponse(401, "Access denied")
            )
        }


    } catch (error) {
        res.status(100).send("Error");
    }
})

app.delete('/article/:id', verifyToken, async (req: express.Request, res: any) => {
    try {
        let user_id = res.tokenData.user._id;

        let article_id: string = req.params.id;

        let article = await ArticleModel.find({_id: article_id ,user: user_id})

        if(article) {

            await ArticleModel.deleteOne({_id: article_id}).then(r => {
                res.status(200).send(
                    new CustomResponse(200, "Article is deleted successfully.")
                )
            }).catch(e => {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong.")
                )
            })

        } else {
            res.stat(401).send(
                new CustomResponse(401, "Access denied")
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
})

// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})