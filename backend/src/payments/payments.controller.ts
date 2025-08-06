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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../dto/payments/create-payment.dto';
import { UpdatePaymentDto } from '../dto/payments/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body(ValidationPipe) createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll(
    @Query('studentId') studentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    if (studentId) {
      return this.paymentsService.findByStudent(parseInt(studentId));
    }
    if (startDate && endDate) {
      return this.paymentsService.getPaymentsByDateRange(startDate, endDate);
    }
    return this.paymentsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get('balance/:studentId')
  calculateBalance(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.paymentsService.calculateStudentBalance(studentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}