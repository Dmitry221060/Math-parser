import { Application } from 'express';
import clientController from '../controllers/client.controller';
import calculatorController from '../controllers/calculator.controller';

export default (app: Application) => {
  app.use(clientController);

  app.use(calculatorController);
};
