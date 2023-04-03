import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, `./${env}.env`);

dotenv.config({ path: envFile });

export default {
  port: process.env.PORT || 3000,
  chatGptApiKey: process.env.CHATGPT_API_KEY,
};
