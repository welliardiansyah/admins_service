import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
} from '@nestjs/common';
import { IApplyDecorator } from 'src/response/response.interface';
import { JwtGuard } from './guard/jwt/jwt.guard';

export function AuthJwtGuard(): IApplyDecorator {
  return applyDecorators(UseGuards(JwtGuard));
}

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    return data ? user[data] : user;
  },
);
