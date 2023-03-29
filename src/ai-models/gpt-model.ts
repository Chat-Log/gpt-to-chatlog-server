const axios = require('axios');
const { Readable } = require('stream');

const OPENAI_API_KEY = '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';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

export const makeCompletion = (content: string) => {
  const data = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
    stream: true,
    max_tokens: 1048,
    n: 1,
  };
  axios
    .post('https://api.openai.com/v1/chat/completions', data, {
      headers,
      responseType: 'stream',
    })
    .then((response) => {
      //   console.log(response.data);
      //   console.log(response.data.choices);
      const stream = response.data;
      const chunks = [];

      // Create a readable stream from the response
      const readableStream = new Readable({
        read() {
          stream.on('data', (chunk) => {
            // console.log(chunk);
            this.push(chunk);
            // chunks.push(chunk);
          });

          stream.on('end', () => {
            //   this.push(null);
            //   console.log("Stream ended.");
          });

          stream.on('error', (error) => {
            //   console.error("Error occurred: ", error);
            //   this.push(null);
          });
        },
      });

      // Do something with each chunk of data
      readableStream.on('data', (chunk) => {
        console.log('Received chunk: ', chunk.toString());
        // Do something with the chunk data here
      });

      // Do something when the stream ends
      readableStream.on('end', () => {
        console.log('Received all chunks.');
        // Do something when all chunks have been received
      });

      // Do something when an error occurs
      readableStream.on('error', (error) => {
        //   console.error("Error occurred: ", error);
        // Do something when an error occurs
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
