import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import type { CreateCustomer } from '@workspace/shared';

@Injectable()
export class CustomersService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(dto: CreateCustomer) {
    return this.customer.create({ data: dto });
  }

  async findAll(tenantId?: string) {
    return this.customer.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Customer ${id} not found`,
      });
    }
    return customer;
  }

  async addLoyaltyPoints(customerId: string, points: number) {
    return this.customer.update({
      where: { id: customerId },
      data: { loyaltyPoints: { increment: points } },
    });
  }
}
