// import exampleRoutes from './examples.js';
import { static as staticDir } from "express";
import authRoutes from './auth_routes.js';

const constructorMethod = (app) => {
  app.use('/', authRoutes);

  app.use("/public", staticDir("src/public"));
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;