import { Injectable } from '@nestjs/common';
import { ApprovedSubjecItemtDto } from 'src/student/dto';
import { EntityManager } from 'typeorm';
import { StudentApprovedSubject } from '../entities/student-approved-subject.entity';
import { SubjectVersionService } from 'src/curriculum/services/subject-version.service';

@Injectable()
export class StudentApprovedSubjectService {
  constructor(private readonly subjectVersionService: SubjectVersionService) {}

  async registerApprovedSubjectsInTransaction(
    studentId: string,
    approvedSubjects: ApprovedSubjecItemtDto[],
    manager: EntityManager,
  ) {
    const repo = manager.getRepository(StudentApprovedSubject);

    const approvedSubjectsToSave = await Promise.all(
      approvedSubjects.map(async ({ approvedSubjectVersionId }) => {
        await this.subjectVersionService.findOne(approvedSubjectVersionId);
        return repo.create({
          approvedSubjectVersion: { id: approvedSubjectVersionId },
          student: { id: studentId },
        });
      }),
    );
    await repo.save(approvedSubjectsToSave);
  }
}
