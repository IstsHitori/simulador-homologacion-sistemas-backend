import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStudentWithEnrollmentDto,
  UpdateStudentWithEnrollmentDto,
} from './dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { StudentApprovedSubject } from 'src/enrollment/entities/student-approved-subject.entity';
import { StudentApprovedSubjectService } from 'src/enrollment/services/student-approved-subject.service';
import { STUDENT_ERROR_MESSAGES } from './constants/error-messages';
import { InjectRepository } from '@nestjs/typeorm';
import { HomologationService } from 'src/homologation/homologation.service';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
    private readonly studentApprovedSubjectService: StudentApprovedSubjectService,
    private readonly homologationService: HomologationService,
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
      //5- Calculamos las materias que el estudiante debe ver
      const subjectsToView =
        await this.homologationService.calculateStudentSubjectToView(
          approvedSubjects,
        );

      return {
        message: `Estudiante ${savedStudent.names} creado correctamente`,
        student: this.formatStudentToResponse(savedStudent),
        subjectsToHomologate,
        subjectsToView,
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

    //Ids de las materias que el estudiante aprobó
    const approvedSubjectIds = foundStudent.studentApprovedSubject.map(s => ({
      approvedSubjectVersionId: s.approvedSubjectVersion.id,
    }));

    //Materias faltantes por ver
    const subjectsToView =
      await this.homologationService.calculateStudentSubjectToView(
        approvedSubjectIds,
      );

    //Materias homologadas
    const subjectsToHomologate =
      await this.homologationService.calculateStudentSubjectToHomologate(
        approvedSubjectIds,
      );

    const studentFormatted = this.mapStudent(foundStudent);

    // Obtener las materias aprobadas con sus detalles completos
    const approvedSubjects = foundStudent.studentApprovedSubject.map(s => ({
      id: s.approvedSubjectVersion.id,
      name: s.approvedSubjectVersion.name,
      code: s.approvedSubjectVersion.code,
      semester: s.approvedSubjectVersion.semester,
      credits: s.approvedSubjectVersion.credits,
      plan: s.approvedSubjectVersion.plan,
      area: s.approvedSubjectVersion.area,
    }));

    return {
      ...studentFormatted,
      approvedSubjects,
      subjectsToHomologate,
      subjectsToView,
    };
  }

  async getStudentReport(id: string) {
    return await this.findOne(id);
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
      gender: student.gender,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentWithEnrollmentDto) {
    return this.dataSource.transaction(async manager => {
      const studentRepository = manager.getRepository(Student);
      const studentApprovedSubjectRepository = manager.getRepository(
        StudentApprovedSubject,
      );

      // Verificar que el estudiante existe
      const foundStudent = await studentRepository.findOne({
        where: { id },
      });
      if (!foundStudent)
        throw new NotFoundException(STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND);

      // Validar duplicados
      await this.validateDuplicate(id, updateStudentDto, studentRepository);

      // Actualizar datos del estudiante si se proporcionan
      if (updateStudentDto.studentData) {
        await studentRepository.update(id, updateStudentDto.studentData);
      }

      // Obtener materias a procesar
      const approvedSubjectsToUse = await this.getApprovedSubjectsForUpdate(
        updateStudentDto,
        id,
        studentApprovedSubjectRepository,
        manager,
      );

      // Calcular homologaciones y obtener detalles
      const subjectsToHomologate =
        await this.homologationService.calculateStudentSubjectToHomologate(
          approvedSubjectsToUse,
        );

      const subjectsToView =
        await this.homologationService.calculateStudentSubjectToView(
          approvedSubjectsToUse,
        );

      return {
        message: `El estudiante ${foundStudent.names} ha sido actualizado`,
        student: this.formatStudentToResponse(foundStudent),
        subjectsToHomologate,
        subjectsToView,
      };
    });
  }

  async generateStudentReport({
    studentData,
    approvedSubjects,
  }: CreateStudentWithEnrollmentDto) {
    // Buscar estudiante por identificación
    const foundStudent = await this.studentRepository.findOne({
      where: { identification: studentData.identification },
      relations: [
        'studentApprovedSubject.approvedSubjectVersion',
        'studentApprovedSubject.approvedSubjectVersion.plan',
        'studentApprovedSubject.approvedSubjectVersion.area',
      ],
    });

    // Si no existe, crearlo
    if (!foundStudent) {
      return this.createStudentAndEnroll({
        studentData,
        approvedSubjects,
      });
    }

    // Si existe, usar las materias aprobadas del estudiante existente
    const approvedSubjectIds = foundStudent.studentApprovedSubject.map(s => ({
      approvedSubjectVersionId: s.approvedSubjectVersion.id,
    }));

    // Materias faltantes por ver
    const subjectsToView =
      await this.homologationService.calculateStudentSubjectToView(
        approvedSubjectIds,
      );

    // Materias homologadas
    const subjectsToHomologate =
      await this.homologationService.calculateStudentSubjectToHomologate(
        approvedSubjectIds,
      );

    const studentFormatted = this.mapStudent(foundStudent);

    return {
      message: 'Reporte generado',
      student: studentFormatted,
      subjectsToHomologate,
      subjectsToView,
    };
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

  private async getApprovedSubjectsForUpdate(
    updateStudentDto: UpdateStudentWithEnrollmentDto,
    studentId: string,
    studentApprovedSubjectRepository: Repository<StudentApprovedSubject>,
    manager: EntityManager,
  ) {
    if (
      updateStudentDto.approvedSubjects &&
      updateStudentDto.approvedSubjects.length > 0
    ) {
      // Actualizar materias aprobadas
      await studentApprovedSubjectRepository.delete({
        student: { id: studentId },
      });
      await this.studentApprovedSubjectService.registerApprovedSubjectsInTransaction(
        studentId,
        updateStudentDto.approvedSubjects,
        manager,
      );
      return updateStudentDto.approvedSubjects;
    }

    // Obtener materias existentes del estudiante
    const approvedSubjectsStudent = await studentApprovedSubjectRepository.find(
      {
        where: { student: { id: studentId } },
        relations: ['approvedSubjectVersion'],
      },
    );

    return approvedSubjectsStudent.map(s => ({
      approvedSubjectVersionId: s.approvedSubjectVersion.id,
    }));
  }

  private async validateDuplicate(
    id: string,
    updateStudentDto: UpdateStudentWithEnrollmentDto,
    studentRepository: Repository<Student>,
  ) {
    if (updateStudentDto.studentData) {
      const duplicateStudent = await studentRepository.findOne({
        where: [
          { identification: updateStudentDto.studentData.identification },
          { email: updateStudentDto.studentData.email },
        ],
      });
      if (duplicateStudent && duplicateStudent.id !== id) {
        throw new BadRequestException(
          STUDENT_ERROR_MESSAGES.STUDENT_ALREADY_EXIST,
        );
      }
    }
  }

  private formatStudentToResponse(student: Student) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, createdAt, ...restStudent } = student;
    return restStudent;
  }
}
