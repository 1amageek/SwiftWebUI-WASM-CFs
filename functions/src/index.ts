import * as functions from 'firebase-functions';
import * as express from 'express'
// import * as path from 'path'

const app = express()

app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/wasm', express.static(__dirname + '/wasm'));

console.log(__dirname)

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const api = functions.https.onRequest(app)
