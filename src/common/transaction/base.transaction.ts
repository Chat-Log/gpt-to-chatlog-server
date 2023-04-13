import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  DataConflictException,
  TransactionFailedException,
} from '../exception/data-access.exception';

@Injectable()
export abstract class BaseTransaction<InputData> {
  protected constructor(private readonly dataSource: DataSource) {}

  protected abstract execute(data: InputData, manager: EntityManager): any;

  private async createRunner(): Promise<QueryRunner> {
    return this.dataSource.createQueryRunner();
  }

  async run(inputData: InputData) {
    const queryRunner = await this.createRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.execute(inputData, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.statusCode === 4101) throw new DataConflictException(err.message);
      if (err.code === '23505') throw new DataConflictException(err.message);

      throw new TransactionFailedException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async runWithinTransaction(data: any, manager: EntityManager) {
    return this.execute(data, manager);
  }
}
