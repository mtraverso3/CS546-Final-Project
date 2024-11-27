// import exampleRoutes from './examples.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  // app.use('/examples', exampleRoutes);

  app.use('/public', staticDir('src/public'));
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
