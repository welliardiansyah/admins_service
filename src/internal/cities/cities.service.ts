import { Injectable } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class InternalCitiesService {
  constructor(private readonly messageService: MessageService) {}
}
