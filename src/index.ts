import { OAuth2Client } from "google-auth-library";

import express from "express";
import "dotenv/config";


const {
    AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET,
    AUTH_GOOGLE_REDIRECT_URI
} = process.env;

const app = express();

const client = new OAuth2Client(
    AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_GOOGLE_REDIRECT_URI
);

app.get("/auth/google", async(req, res) => {

    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ["profile", "email"],
    });

      res.redirect(url);
})


app.get("/auth/google/callback", async(req, res) => {

    const { code } = req.query;
    if(!code) {
        return void res.status(400).json({error:
            "Missing code"
        });
    }

    const { tokens } = await client.getToken(code.toString());
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    res.json(userInfoResponse.data);
})


app.listen(3000, () => {
    console.log("Server running on port 3000");
})