import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

/**
 * Translates the Left side of a use case Either into an HTTP error.
 * The domain only knows about its own error classes; HTTP status codes are
 * an infra concern.
 */
export function useCaseErrorToHttp(error: Error | null): HttpException {
  if (error instanceof ResourceNotFoundError) {
    return new NotFoundException(error.message)
  }

  if (error instanceof NotAllowedError) {
    return new ForbiddenException(error.message)
  }

  if (error instanceof StudentAlreadyExistsError) {
    return new ConflictException(error.message)
  }

  if (error instanceof WrongCredentialsError) {
    return new UnauthorizedException(error.message)
  }

  return new BadRequestException(error?.message)
}
