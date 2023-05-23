import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { Readable } from 'stream';
import { join } from 'path';
import { AbortSignal } from '../../common/interface/interface';

@Injectable()
export class AlpacaModelService implements OnModuleInit, OnModuleDestroy {
  private chatProcess: ChildProcess;
  private isFirst = true;
  public static instance: AlpacaModelService;

  private constructor() {}

  static getInstance(): AlpacaModelService {
    if (!AlpacaModelService.instance) {
      AlpacaModelService.instance = new AlpacaModelService();
    }

    return AlpacaModelService.instance;
  }

  onModuleInit() {
    const path = join(__dirname, '../../../alpaca.cpp', 'chat');

    const modelPath = join(
      __dirname,
      '../../../alpaca.cpp',
      'ggml-alpaca-7b-q4.bin',
    );
    this.chatProcess = spawn(path, ['-m', modelPath]);

    this.chatProcess.on('error', (err) => {
      throw new InternalServerErrorException(err);
    });
  }

  onModuleDestroy() {
    this.chatProcess.kill();
  }

  async sendQuestion(
    question: string,
    abortSignal: AbortSignal,
  ): Promise<Readable> {
    const responseStream = new Readable({
      read() {},
    });

    const onData = (data: Buffer) => {
      if (data.toString().includes('>')) {
        if (this.isFirst) {
          this.isFirst = false;
        } else {
          responseStream.push(null);
          this.chatProcess.stdout.off('data', onData);
        }
      } else {
        const cleanedData = data.toString().replace(/\x1B\[\d+m/g, '');

        responseStream.push(cleanedData);
        if (abortSignal.isAborted) {
          this.chatProcess.kill('SIGINT');
          return responseStream;
        }
      }
    };
    this.chatProcess.stdout.on('data', onData);
    this.chatProcess.stdin.write(question + '\n');

    return responseStream;
  }
}
