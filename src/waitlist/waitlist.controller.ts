import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { createWaitlistEntrySchema } from '@workspace/shared';

import { parsePayload } from '../common/zod/parse-payload';
import { WaitlistService } from './waitlist.service';

@Controller()
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @MessagePattern({ cmd: 'add_to_waitlist' })
  add(@Payload() payload: unknown) {
    const dto = parsePayload(createWaitlistEntrySchema, payload);
    return this.waitlistService.add(dto);
  }

  @MessagePattern({ cmd: 'find_waitlist' })
  findAll(@Payload() payload: unknown) {
    const { tenantId } = (payload as { tenantId?: string }) ?? {};
    return this.waitlistService.findAll(tenantId);
  }

  @MessagePattern({ cmd: 'seat_waitlist_entry' })
  seat(@Payload('id') id: string) {
    return this.waitlistService.seat(id);
  }

  @MessagePattern({ cmd: 'remove_waitlist_entry' })
  remove(@Payload('id') id: string) {
    return this.waitlistService.remove(id);
  }
}
