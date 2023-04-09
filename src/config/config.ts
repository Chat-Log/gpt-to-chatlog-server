import * as dotenv from 'dotenv';
import * as path from 'path';
import * as process from 'process';

const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `../../src/config/${env}.env`);
dotenv.config({ path: envFile });

export default {
  port: process.env.PORT || 3000,
  chatGptApiKey: process.env.CHATGPT_API_KEY,
};
