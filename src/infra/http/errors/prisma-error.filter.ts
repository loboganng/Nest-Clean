import {
  ArgumentsHost,
  Catch,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'

/**
 * Maps database constraint errors that are caused by the client to proper
 * HTTP errors instead of a generic 500:
 * - P2002 unique constraint (e.g. two questions whose titles give the same slug) -> 409
 * - P2003 foreign key (e.g. answering a question that does not exist) -> 404
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === 'P2002') {
      return super.catch(
        new ConflictException('A resource with the same data already exists.'),
        host,
      )
    }

    if (exception.code === 'P2003') {
      return super.catch(
        new NotFoundException('A related resource was not found.'),
        host,
      )
    }

    return super.catch(exception, host)
  }
}
