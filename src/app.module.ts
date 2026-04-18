import { Module } from '@nestjs/common';

import { CustomersModule } from './customers/customers.module';
import { HealthModule } from './health/health.module';
import { ReservationsModule } from './reservations/reservations.module';
import { WaitlistModule } from './waitlist/waitlist.module';

@Module({
  imports: [HealthModule, CustomersModule, ReservationsModule, WaitlistModule],
})
export class AppModule {}
