import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import type { CreateWaitlistEntry } from '@workspace/shared';

@Injectable()
export class WaitlistService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async add(dto: CreateWaitlistEntry) {
    return this.waitlistEntry.create({ data: dto });
  }

  async findAll(tenantId?: string) {
    return this.waitlistEntry.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        seatedAt: null,
      },
      include: { customer: true },
      orderBy: { arrivedAt: 'asc' },
    });
  }

  async seat(id: string) {
    const entry = await this.waitlistEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Waitlist entry ${id} not found`,
      });
    }
    return this.waitlistEntry.update({
      where: { id },
      data: { seatedAt: new Date() },
    });
  }

  async remove(id: string) {
    return this.waitlistEntry.delete({ where: { id } });
  }
}
