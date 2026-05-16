import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialController } from './testimonial.controller';
import { TestimonialAdminController } from './testimonial.admin.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialRepository } from './testimonial.repository';
import { Testimonial } from './testimonial.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Testimonial])],
    controllers: [TestimonialController, TestimonialAdminController],
    providers: [TestimonialService, TestimonialRepository],
    exports: [TestimonialService, TestimonialRepository],
})
export class TestimonialsModule {}
