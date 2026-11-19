import { Controller, Get, Query } from '@nestjs/common'
import { FetchRecipientNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-recipient-notifications'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import {
  PageQueryParam,
  pageQueryValidationPipe,
} from '../pipes/page-query-param'
import { NotificationPresenter } from '../presenters/notification-presenter'

@Controller('/notifications')
export class FetchNotificationsController {
  constructor(
    private fetchRecipientNotifications: FetchRecipientNotificationsUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchRecipientNotifications.execute({
      recipientId: user.sub,
      page,
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return {
      notifications: result.value.notifications.map(
        NotificationPresenter.toHTTP,
      ),
    }
  }
}
