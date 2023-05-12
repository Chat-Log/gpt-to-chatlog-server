import { Module } from '@nestjs/common';
import { AlpacaModelService } from './alpaca/alpaca-model.service';

@Module({
  providers: [
    {
      provide: AlpacaModelService,
      useValue: AlpacaModelService.getInstance(),
    },
  ],
  exports: [AlpacaModelService],
})
export class ModelsModule {}
