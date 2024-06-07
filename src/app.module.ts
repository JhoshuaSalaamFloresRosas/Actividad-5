import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatesModule } from './states/states.module';
import { CitiesModule } from './cities/cities.module';
import { LocationsModule } from './locations/locations.module';
import { ClientsModule } from './clients/clients.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [StatesModule, CitiesModule, LocationsModule, ClientsModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
