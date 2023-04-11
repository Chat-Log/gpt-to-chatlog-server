const axios = require('axios');
import { Readable } from 'stream';

import { Response } from 'express';
const OPENAI_API_KEY = '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';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

export const makeCompletion = (content: string, res: Response) => {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
    stream: true,
    max_tokens: 1048,
    n: 1,
  };
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    // Connection: 'keep-alive',
  });

  axios
    .post('https://api.openai.com/v1/chat/completions', data, {
      headers,
      responseType: 'stream',
    })
    .then((response) => {
      const stream = response.data as Readable;

      stream.on('data', (chunk) => {
        const encodedData = chunk.toString('base64'); // encode the data as Base64
        const decodedData = Buffer.from(encodedData, 'base64').toString(
          'utf-8',
        ); // decode the data from Base64 and convert to a string
        const data = decodedData.split('data: ')[1];

        if (data == '[DONE]') {
          console.log('done');
          return;
        }
        if (!data) {
          console.log('no data');
          return;
        }
        if (data) {
          if (data.startsWith('{')) {
            const obj = JSON.parse(data);
            const writeData = obj.choices && obj.choices[0].delta.content;
          }
        }
      });
      stream.on('end', () => {
        res.end();
      });

      const chunks = [];
    });
};
