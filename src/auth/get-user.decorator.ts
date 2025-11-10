import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
    (data: keyof any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // added by JwtAuthGuard

        if (data === 'id') {
            return user?.userId || user?.id;
        }
        return data ? user?.[data] : user;
    },
);
