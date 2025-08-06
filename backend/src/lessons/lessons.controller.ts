import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  ValidationPipe
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from '../dto/lessons/create-lesson.dto';
import { UpdateLessonDto } from '../dto/lessons/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body(ValidationPipe) createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll(@Query('studentId') studentId?: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (studentId) {
      return this.lessonsService.findByStudent(parseInt(studentId));
    }
    if (startDate && endDate) {
      return this.lessonsService.findByDateRange(startDate, endDate);
    }
    return this.lessonsService.findAll();
  }

  @Get('today')
  findTodayLessons() {
    return this.lessonsService.findTodayLessons();
  }

  @Get('stats')
  getStats() {
    return this.lessonsService.getLessonStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(ValidationPipe) updateLessonDto: UpdateLessonDto
  ) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Patch(':id/complete')
  completeLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { rating?: number; notes?: string; skillsAssessed?: string }
  ) {
    return this.lessonsService.completeLesson(id, body.rating, body.notes, body.skillsAssessed);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }
}