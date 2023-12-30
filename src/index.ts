// const express = require('express');
import express from 'express';

// invoke the express
const app = express();

// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})