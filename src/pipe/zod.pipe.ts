import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodIssue, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      const exception = error.errors.map((issue: ZodIssue) => ({
        path: issue.path,
        message: issue.message,
      }));
      throw new BadRequestException(exception);
    }
  }
}
