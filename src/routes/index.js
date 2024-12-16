import { static as staticDir } from "express";
import authRoutes from "./auth_routes.js";
import internalRoutes from "./internal_routes.js";
import watchRoutes from "./watch_routes.js";
import uploadRoutes from "./upload_routes.js";

const constructorMethod = (app) => {
  app.use("/watch", watchRoutes);
  app.use("/upload", uploadRoutes);
  app.use("/", authRoutes);
  app.use("/", internalRoutes);

  app.use("/public", staticDir("src/public"));
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
