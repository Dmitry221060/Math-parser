import express from 'express';

import Calculator from '../models/calculator';
import { ValidationException } from '../models/expression/defs';
import logger from '../util/logger';

const app = express();
const calculator = new Calculator();

app.post('/calculate', (req, res) => {
  const rawExpression = req.body?.data;
  if (!rawExpression || typeof rawExpression !== 'string')
    return res.status(400).end('No expression was given');

  const result = calculator.run(rawExpression);
  logger.debug(result);

  if (result.error) {
    if (result.error instanceof ValidationException)
      return res.status(400).end('Invalid expression');

    logger.error(result.error);
    return res.status(500).end('Internal calculation error');
  }

  if (result.answer === null) return res.status(500).end('Internal error');

  res.status(200).end(result.answer.toString());
});

export default app;
