import 'dotenv/config';
import { Hono } from 'hono';

import { logger } from 'hono/logger';
import usersRouter from './api/users';
import authRouter from './api/auth';
import productRouter from './api/product';
import orderRouter from './api/order';

const app = new Hono();

app.use('*', logger());

app.basePath('/api').route('/users', usersRouter).route('/', authRouter).route('/products', productRouter).route('/orders', orderRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});
 


export default app;
