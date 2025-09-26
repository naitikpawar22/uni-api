import { app, connectDB } from '../server.js';
import serverless from 'serverless-http';

export const handler = async (req, res) => {
  await connectDB(); // ensure MongoDB is connected per request
  return serverless(app)(req, res);
};
