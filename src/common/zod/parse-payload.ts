import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { z, ZodTypeAny } from 'zod';

export function parsePayload<T extends ZodTypeAny>(
  schema: T,
  value: unknown,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: result.error.flatten(),
    });
  }
  return result.data;
}
