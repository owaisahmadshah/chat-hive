import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

export function assertExists<T>(
  value: T | null | undefined,
  message: string,
): asserts value is T {
  if (value == null) {
    throw new NotFoundException(message);
  }
}

export function assertForbidden(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new ForbiddenException(message);
  }
}

export function assertConflict(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new ConflictException(message);
  }
}

export function assertBadRequest(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new BadRequestException(message);
  }
}
