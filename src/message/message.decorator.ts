import { Inject } from '@nestjs/common';

export function Message(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(`MessageService`);
}

export function Response(): (
  target: Record<string, any>,
  key: string | symbol | boolean,
  index?: number,
) => void {
  return Inject(`ResponseService`);
}
