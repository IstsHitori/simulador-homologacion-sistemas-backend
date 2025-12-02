import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentWithEnrollmentDto } from './dto/update-student-with-enrollment.dto';
import { CreateStudentWithEnrollmentDto, SearchStudentDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/user/constants';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('report')
  generateReport(@Body() createStudentDto: CreateStudentWithEnrollmentDto) {
    return this.studentService.generateStudentReport(createStudentDto);
  }

  @Post('exist-student')
  existStudent(@Body() searchStudentDto: SearchStudentDto) {
    return this.studentService.existStudent(searchStudentDto);
  }

  @Post()
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  create(@Body() createStudentDto: CreateStudentWithEnrollmentDto) {
    return this.studentService.createStudentAndEnroll(createStudentDto);
  }

  @Get()
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.findOne(id);
  }

  @Get(':id/report')
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  getStudentReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.getStudentReport(id);
  }

  @Patch(':id')
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentWithEnrollmentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Auth(ROLE.ADMIN, ROLE.NORMAL)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentService.remove(id);
  }
}
