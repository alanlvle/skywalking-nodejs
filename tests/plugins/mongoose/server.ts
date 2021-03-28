/*!
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as http from 'http';
import mongoose from 'mongoose';
import agent from '../../../src';

process.env.SW_AGENT_LOGGING_LEVEL = 'ERROR';

agent.start({
  serviceName: 'server',
  maxBufferSize: 1000,
});

const server = http.createServer(async (req, res) => {
  await new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://root:root@${process.env.MONGO_HOST}:27017/admin`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,

    }).then(() => {
      const Test = new mongoose.Schema({
        title: String
      });

      const modelTest = mongoose.model('Test', Test);

      modelTest.find().then(
        (result: any) => {
          res.end(`${result}`);
          resolve(null);
          mongoose.connection.close();
        },

        (err: Error) => {
          res.end(`${err}`);
          resolve(null);
          mongoose.connection.close();
        },
      );

    }).catch((err: Error) => {
      res.end(`${err}`);
      resolve(null);
    });
  });
});

server.listen(5000, () => console.info('Listening on port 5000...'));
