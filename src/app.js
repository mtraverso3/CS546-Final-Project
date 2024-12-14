import express from "express";

const app = express();
import configRoutes from "./routes/index.js";
import session from 'express-session';
import exphbs from "express-handlebars";
import "dotenv/config";
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('views', path.join(__dirname, 'views'));

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
  partialsDir: path.join(__dirname, 'views/partials'),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(
  session({
       name: 'AuthenticationState',
       secret: "some secret string!",
       saveUninitialized: false,
       resave: false
  })
);

configRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("We've now got a server!");
  console.log(
    `Your routes will be running on http://localhost:${process.env.PORT}`,
  );
});
