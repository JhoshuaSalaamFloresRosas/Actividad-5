import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StatesController],
  providers: [StatesService,PrismaService],
})
export class StatesModule {}
