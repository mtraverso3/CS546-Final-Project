import express from "express";

const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import 'dotenv/config';

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
  partialsDir: ["views/partials/"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${process.env.PORT}`);
});
