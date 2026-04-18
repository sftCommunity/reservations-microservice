import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { createCustomerSchema } from '@workspace/shared';

import { parsePayload } from '../common/zod/parse-payload';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern({ cmd: 'create_customer' })
  create(@Payload() payload: unknown) {
    const dto = parsePayload(createCustomerSchema, payload);
    return this.customersService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_customers' })
  findAll(@Payload() payload: unknown) {
    const { tenantId } = (payload as { tenantId?: string }) ?? {};
    return this.customersService.findAll(tenantId);
  }

  @MessagePattern({ cmd: 'find_one_customer' })
  findOne(@Payload('id') id: string) {
    return this.customersService.findOne(id);
  }

  @MessagePattern({ cmd: 'add_loyalty_points' })
  addLoyaltyPoints(@Payload() payload: { customerId: string; points: number }) {
    return this.customersService.addLoyaltyPoints(
      payload.customerId,
      payload.points,
    );
  }
}
