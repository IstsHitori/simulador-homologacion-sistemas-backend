import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateStudentWithEnrollmentDto } from './dto/update-student-with-enrollment.dto';
import { CreateStudentWithEnrollmentDto } from './dto';
import { DataSource } from 'typeorm';
import { Student } from './entities/student.entity';
import { StudentApprovedSubjectService } from 'src/enrollment/services/student-approved-subject.service';
import { STUDENT_ERROR_MESSAGES } from './constants/error-messages';

@Injectable()
export class StudentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly studentApprovedSubjectService: StudentApprovedSubjectService,
  ) {}
  async createStudentAndEnroll({
    studentData,
    approvedSubjects,
  }: CreateStudentWithEnrollmentDto) {
    return this.dataSource.transaction(async manager => {
      const studentRepository = manager.getRepository(Student);
      //1- Buscar el estudiante
      const foundUser = await studentRepository.findOne({
        where: { identification: studentData.identification },
      });
      if (foundUser)
        throw new BadRequestException(
          STUDENT_ERROR_MESSAGES.STUDENT_ALREADY_EXIST,
        );
      //2- Creamos el estudiante
      const savedStudent = await studentRepository.save(
        studentRepository.create(studentData),
      );
      //3- Registramos las materias aprobadas
      await this.studentApprovedSubjectService.registerApprovedSubjectsInTransaction(
        savedStudent.id,
        approvedSubjects,
        manager,
      );
      return `Estudiante ${savedStudent.names} creado correctamente`;
    });
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: string) {
    return `This action returns a #${id} student`;
  }

  update(id: string, updateStudentDto: UpdateStudentWithEnrollmentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: string) {
    return `This action removes a #${id} student`;
  }
}
