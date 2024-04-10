import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from 'path';
import { auth as qlikAuth, users as qlikUsers } from "@qlik/api";
import { fileURLToPath } from 'url';
import {myConfig, myParamsConfig, getParameters} from "./config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
app.use(express.static('src'));
const PORT = process.env.PORT || 3000;

const config = {
  authType: "oauth2",
  host: "https://" + myConfig.tenantHostname,
  clientId: myConfig.oAuthClientId,
  clientSecret: myConfig.oAuthClientSecret,
  noCache: true,
};

qlikAuth.setDefaultHostConfig(config);

// Configure session middleware
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Get Qlik user (from Qlik-API: https://github.com/qlik-oss/qlik-api-ts/blob/9904608c39fd038c711f38cea6415d5ea6091a67/users.js)
async function getQlikUser(userEmail) {
  const { data: user } = await qlikUsers.getUsers(
    {
      filter: `email eq "${userEmail}"`,
    },
    {
      hostConfig: {
        ...config,
        scope: "admin_classic user_default",
      },
    },
  );
  return user;
}


// Set up a route to serve the login form
app.get("/login", (req, res) => {

  res.sendFile(__dirname + "/src/login.html");
});



// Handle form submission of login.html 
app.post("/login", (req, res) => {

  const { email } = req.body;
  if (email) {
    // Save email to session
    req.session.email = email;
    console.log("Logging in user:", email);
    res.redirect("/");
  } else {
    res.send("Please provide an email.");
  }
});


// Get access token (M2M impersonation) for qlik-embed
app.post("/access-token", async (req, res) => {
  const userId = req.session.userId;
  if (userId != undefined && userId.length > 0) {
    try {
      const accessToken = await qlikAuth.getAccessToken({
        hostConfig: {
          ...config,
          userId,
          scope: "user_default",
        },
      });
      console.log("Retrieved access token for: ", userId);
      res.send(accessToken);
    } catch (err) {
      console.log(err);
      res.status(401).send("No access");
    }
  }
});


// Get access token (M2M impersonation) for qlik-embed
app.post("/config", async (req, res) => {
  const userId = req.session.userId;
  const params = await getParameters(userId);
  res.status(200).send(params);

  
});



// Set up a route for the Home page
app.get("/", async (req, res) => {
  const email = req.session.email;

  (async () => {
    if (email) {
      //check to see if a matching user email exists on the tenant
      const currentUser = await getQlikUser(email);
      console.log("USER ", currentUser);


      // If user doesn't exist, create it (optional)
      if (currentUser.data.length !== 1) {
        // We have no user, so create
        const currentUser = await qlikUsers.createUser(
          {
            name: "anon_" + req.session.email,
            email: req.session.email,
            subject: "anon_" + req.session.email,
            status: "active",
          },
          {
            hostConfig: {
              ...config,
              scope: "admin_classic user_default",
            },
          },
        );
        console.log("Created user: ", currentUser);
        req.session.userId = currentUser.data.id;
      } else {
        // We have a user, continue
        req.session.userId = currentUser.data[0].id;
      }
      console.log("Current user ID:", req.session.userId);
      res.sendFile(__dirname + "/src/home.html");
    } else {
      res.redirect("/login");
    }
  })();
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}! Go to http://localhost:${PORT}`);
});