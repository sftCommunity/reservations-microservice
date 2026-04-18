import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  createReservationSchema,
  updateReservationPayloadSchema,
} from '@workspace/shared';

import { parsePayload } from '../common/zod/parse-payload';
import { ReservationsService } from './reservations.service';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @MessagePattern({ cmd: 'create_reservation' })
  create(@Payload() payload: unknown) {
    const dto = parsePayload(createReservationSchema, payload);
    return this.reservationsService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_reservations' })
  findAll(@Payload() payload: unknown) {
    const { tenantId, date } = (payload as { tenantId?: string; date?: string }) ?? {};
    return this.reservationsService.findAll(
      tenantId,
      date ? new Date(date) : undefined,
    );
  }

  @MessagePattern({ cmd: 'find_one_reservation' })
  findOne(@Payload('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_reservation' })
  update(@Payload() payload: unknown) {
    const dto = parsePayload(updateReservationPayloadSchema, payload);
    return this.reservationsService.update(dto);
  }

  @MessagePattern({ cmd: 'cancel_reservation' })
  cancel(@Payload('id') id: string) {
    return this.reservationsService.cancel(id);
  }
}
