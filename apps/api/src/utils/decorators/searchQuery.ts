import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type IListQuery = {
  page: number
  perPage: number
  sort: string
  order: 'ASC' | 'DESC'
}

export const ListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const query = ctx.switchToHttp().getRequest().query

    return {
      page: query?.page || 1,
      perPage: query?.perPage || 10,
      sort: query?.sort,
      order: query?.order || 'ASC'
    }
  },
);