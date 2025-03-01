import express, { urlencoded } from 'express'

const app = express()

import logger from "./logger.js";
import morgan from 'morgan';

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());
app.use(urlencoded({extended:false}))

import healthCheckRoute from './routes/healthcheck.route.js'
import userRoute from './routes/user.route.js'
import { errorHandler } from './middlewares/error.middleware.js';
app.use('/api/v1/',healthCheckRoute);
app.use('/api/v2/',userRoute);


app.use(errorHandler);
export default app;