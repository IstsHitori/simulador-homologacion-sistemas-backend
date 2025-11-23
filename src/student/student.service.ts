import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStudentWithEnrollmentDto,
  UpdateStudentWithEnrollmentDto,
} from './dto';
import { DataSource, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { StudentApprovedSubject } from 'src/enrollment/entities/student-approved-subject.entity';
import { StudentApprovedSubjectService } from 'src/enrollment/services/student-approved-subject.service';
import { STUDENT_ERROR_MESSAGES } from './constants/error-messages';
import { InjectRepository } from '@nestjs/typeorm';
import { HomologationService } from 'src/homologation/homologation.service';
import { SubjectVersionService } from 'src/curriculum/services/subject-version.service';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
    private readonly studentApprovedSubjectService: StudentApprovedSubjectService,
    private readonly homologationService: HomologationService,
    private readonly subjectVersionService: SubjectVersionService,
  ) {}

  async createStudentAndEnroll({
    studentData,
    approvedSubjects,
  }: CreateStudentWithEnrollmentDto) {
    return this.dataSource.transaction(async manager => {
      const studentRepository = manager.getRepository(Student);
      //1- Buscar el estudiante
      const foundStudent = await studentRepository.findOne({
        where: [
          { identification: studentData.identification },
          { email: studentData.email },
        ],
      });
      if (foundStudent)
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
      //4- Calculamos que asignaturas puede homologar
      const subjectsToHomologate =
        await this.homologationService.calculateStudentSubjectToHomologate(
          approvedSubjects,
        );
      //5- Para obtener la asignaturas que el estudiante ya cursó
      const subjectjs =
        await this.subjectVersionService.getSubjectVersionsByIds(
          approvedSubjects.map(({ approvedSubjectVersionId }) =>
            approvedSubjectVersionId.toString(),
          ),
        );
      return {
        message: `Estudiante ${savedStudent.names} creado correctamente`,
        subjectsToHomologate,
        studentApprovedSubject: subjectjs,
      };
    });
  }

  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(id: string) {
    const foundStudent = await this.studentRepository.findOne({
      where: { id },
      relations: [
        'studentApprovedSubject.approvedSubjectVersion',
        'studentApprovedSubject.approvedSubjectVersion.plan',
        'studentApprovedSubject.approvedSubjectVersion.area',
      ],
    });
    if (!foundStudent)
      throw new NotFoundException(STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND);

    return this.mapStudent(foundStudent);
  }

  private mapStudent(student: Student) {
    return {
      id: student.id,
      identification: student.identification,
      email: student.email,
      names: student.names,
      lastNames: student.lastNames,
      semester: student.semester,
      cityResidence: student.cityResidence,
      address: student.address,
      telephone: student.telephone,
      gender: student.gender,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      approvedSubjects: student.studentApprovedSubject.map(approved => ({
        id: approved.approvedSubjectVersion.id,
        name: approved.approvedSubjectVersion.name,
        code: approved.approvedSubjectVersion.code,
        semester: approved.approvedSubjectVersion.semester,
        credits: approved.approvedSubjectVersion.credits,
        plan: approved.approvedSubjectVersion.plan,
        area: approved.approvedSubjectVersion.area,
      })),
    };
  }
  async update(id: string, updateStudentDto: UpdateStudentWithEnrollmentDto) {
    return this.dataSource.transaction(async manager => {
      const studentRepository = manager.getRepository(Student);
      const studentApprovedSubjectRepository = manager.getRepository(
        StudentApprovedSubject,
      );

      // 1- Verificar que el estudiante existe
      const foundStudent = await studentRepository.findOne({
        where: { id },
      });
      if (!foundStudent)
        throw new NotFoundException(STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND);
      // 2- Actualizar datos del estudiante si se proporcionan
      if (updateStudentDto.studentData) {
        await studentRepository.update(id, updateStudentDto.studentData);
      }

      // 3- Actualizar materias aprobadas si se proporcionan
      if (
        updateStudentDto.approvedSubjects &&
        updateStudentDto.approvedSubjects.length > 0
      ) {
        // Eliminar las materias aprobadas anteriores
        await studentApprovedSubjectRepository.delete({ student: { id } });

        // Registrar las nuevas materias aprobadas
        await this.studentApprovedSubjectService.registerApprovedSubjectsInTransaction(
          id,
          updateStudentDto.approvedSubjects,
          manager,
        );
      }

      return `El estudiante ${foundStudent.names} ha sido actualizado`;
    });
  }

  async remove(id: string) {
    const foundStudent = await this.studentRepository.findOne({
      where: { id },
    });
    if (!foundStudent)
      throw new NotFoundException(STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND);
    await this.studentRepository.remove(foundStudent);
    return `El estudiante ${foundStudent.names} ha sido eliminado correctamente`;
  }
}
