import { ApiProperty, ApiResponse, ApiResponseMetadata } from '@nestjs/swagger';

class BadRequest {
  @ApiProperty({ type: String, description: 'Error message' })
  message: string;

  @ApiProperty({ type: String, description: 'Error type' })
  error: string;

  @ApiProperty({ type: Number, description: 'Error status code' })
  statusCode: number;
}

export const BadRequestResponse = (): MethodDecorator & ClassDecorator =>
  ApiResponse({ type: BadRequest, status: 400 });

export const SuccessResponse = (options?: {
  type?: ApiResponseMetadata['type'];
  isArray?: boolean;
}) =>
  ApiResponse({ status: 200, type: options?.type, isArray: options?.isArray });
