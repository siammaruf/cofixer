import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessageController } from './contact-message.controller';
import { ContactMessageAdminController } from './contact-message.admin.controller';
import { ContactMessageService } from './contact-message.service';
import { ContactMessageRepository } from './contact-message.repository';
import { ContactMessage } from './contact-message.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ContactMessage])],
    controllers: [ContactMessageController, ContactMessageAdminController],
    providers: [ContactMessageService, ContactMessageRepository],
    exports: [ContactMessageService, ContactMessageRepository],
})
export class ContactsModule {}
