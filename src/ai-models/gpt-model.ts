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
            const encodedData = chunk.toString('base64'); // encode the data as Base64
            const decodedData = Buffer.from(encodedData, 'base64').toString(
              'utf-8',
            ); // decode the data from Base64 and convert to a string
            // console.log(decodedData);
            const data = decodedData.split('data: ')[1];
            // console.log(data);

            if (data == '[DONE]') {
              console.log('done');
              return;
              // const obj = JSON.parse(decodedData);
            }
            if (!data) {
              console.log('no data');
              return;
            }
            if (data) {
              // console.log(data);
              if (data.startsWith('{')) {
                const obj = JSON.parse(data);
                console.log(obj.choices);
              }
            }
            // this.push(chunk);
            // chunks.push(chunk);
          });

          stream.on('end', () => {
            this.push(null);
            console.log('Stream ended.');
          });

          stream.on('error', (error) => {
            console.error('Error occurred: ', error);
            this.push(null);
          });
        },
      });

      // Do something with each chunk of data
      readableStream.on('data', (chunk) => {
        // console.log(chunk);
        // console.log('Received chunk: ', chunk.toString());
        // const encodedData = chunk.toString('base64'); // encode the data as Base64
        // const decodedData = Buffer.from(encodedData, 'base64').toString(
        //   'utf-8',
        // ); // decode the data from Base64 and convert to a string
        // // console.log(decodedData);
        // const data = decodedData.split('data: ')[1];
        // // console.log(data);
        // if (data == '[DONE]') {
        //   console.log('done');
        //   // const obj = JSON.parse(decodedData);
        // }
        // if (!data) {
        //   console.log('no data');
        // }
        // console.log(a);
        // console.log(obj);
        // console.log(chunk.data);
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
