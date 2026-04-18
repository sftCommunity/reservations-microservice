import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import type {
  CreateReservation,
  UpdateReservationPayload,
} from '@workspace/shared';

@Injectable()
export class ReservationsService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(dto: CreateReservation) {
    return this.reservation.create({ data: dto });
  }

  async findAll(tenantId?: string, date?: Date) {
    return this.reservation.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(date
          ? {
              datetime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999)),
              },
            }
          : {}),
      },
      include: { customer: true },
      orderBy: { datetime: 'asc' },
    });
  }

  async findOne(id: string) {
    const reservation = await this.reservation.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!reservation) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Reservation ${id} not found`,
      });
    }
    return reservation;
  }

  async update(dto: UpdateReservationPayload) {
    const { id, ...data } = dto;
    return this.reservation.update({ where: { id }, data });
  }

  async cancel(id: string) {
    return this.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
