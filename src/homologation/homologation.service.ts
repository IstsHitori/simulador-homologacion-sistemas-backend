import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { META_PLANS } from 'src/curriculum/constants';
import { Equivalence, Plan, SubjectVersion } from 'src/curriculum/entities';
import { ApprovedSubjecItemtDto } from 'src/student/dto';
import { In, Repository } from 'typeorm';
import { HOMOLOGATION_ERROR_MESSAGES } from './constants/error-messages';
@Injectable()
export class HomologationService {
  constructor(
    @InjectRepository(Equivalence)
    private readonly equivalenceRepository: Repository<Equivalence>,
    @InjectRepository(SubjectVersion)
    private readonly subjectVersionRepository: Repository<SubjectVersion>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async calculateStudentSubjectToHomologate(
    approvedSubjects: ApprovedSubjecItemtDto[],
  ): Promise<SubjectVersion[]> {
    // 1. Extraer los IDs de las materias viejas aprobadas

    const approvedOldSubjectIds = approvedSubjects.map(
      subj => subj.approvedSubjectVersionId,
    );

    if (approvedOldSubjectIds.length === 0) {
      return [];
    }

    // 2. Buscar en la tabla Equivalence todas las materias nuevas que se cubren
    // El "In" permite buscar por múltiples IDs en una sola consulta.
    const equivalences = await this.equivalenceRepository.find({
      select: ['newSubjectVersionId'],
      where: {
        oldSubjectVersionId: In(approvedOldSubjectIds),
      },
    });

    // 3. Obtener los IDs únicos de las materias nuevas a homologar
    const subjectsToHomologateIds = [
      ...new Set(equivalences.map(eq => eq.newSubjectVersionId)),
    ];

    if (subjectsToHomologateIds.length === 0) {
      return [];
    }

    // 4. Buscar la versión del Plan Nuevo para asegurar la coherencia
    const newPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.NEW_SUBJECT_PLAN },
    });

    if (!newPlan) {
      // Esto solo debería ocurrir si el seed no se ejecutó correctamente
      throw new BadRequestException(
        HOMOLOGATION_ERROR_MESSAGES.NEW_SUBJECT_PLAN_NOT_FOUND,
      );
    }

    // 5. Devolver las entidades SubjectVersion de las materias homologables
    const subjectsToHomologate = await this.subjectVersionRepository.find({
      where: {
        id: In(subjectsToHomologateIds),
        plan: { id: newPlan.id },
      },
      relations: ['area', 'plan'],
    });

    // 6. Ordenar por semestre de mayor a menor (descendente)
    return subjectsToHomologate.sort((a, b) => b.semester - a.semester);
  }

  async calculateStudentSubjectToView(
    approvedSubjects: ApprovedSubjecItemtDto[],
    studentSemester: number,
  ): Promise<SubjectVersion[]> {
    // 1. Obtener todas las materias homologables del estudiante
    const subjectsToHomologate =
      await this.calculateStudentSubjectToHomologate(approvedSubjects);

    // 2. Buscar la versión del Plan Nuevo
    const newPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.NEW_SUBJECT_PLAN },
    });

    if (!newPlan) {
      throw new BadRequestException(
        HOMOLOGATION_ERROR_MESSAGES.NEW_SUBJECT_PLAN_NOT_FOUND,
      );
    }

    // 3. Obtener TODAS las materias del plan nuevo (sin filtrar por semestre)
    const allNewSubjects = await this.subjectVersionRepository.find({
      where: {
        plan: { id: newPlan.id },
      },
      relations: ['area', 'plan'],
    });

    // 4. Extraer los IDs de las materias homologadas
    const homologatedSubjectIds = new Set(
      subjectsToHomologate.map(subject => subject.id),
    );

    // 5. Filtrar las materias que faltan (no están homologadas)
    const subjectsToView = allNewSubjects.filter(
      subject => !homologatedSubjectIds.has(subject.id),
    );

    // 6. Ordenar por semestre de menor a mayor (ascendente: 1 a 10)
    return subjectsToView.sort((a, b) => a.semester - b.semester);
  }
}
