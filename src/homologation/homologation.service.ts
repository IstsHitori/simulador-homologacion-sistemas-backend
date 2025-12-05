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

    // 2. Buscar la versión del Plan Viejo
    const oldPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.OLD_SUBJECT_PLAN },
    });

    if (!oldPlan) {
      throw new BadRequestException(
        HOMOLOGATION_ERROR_MESSAGES.NEW_SUBJECT_PLAN_NOT_FOUND,
      );
    }

    // 3. Buscar la versión del Plan Nuevo
    const newPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.NEW_SUBJECT_PLAN },
    });

    if (!newPlan) {
      throw new BadRequestException(
        HOMOLOGATION_ERROR_MESSAGES.NEW_SUBJECT_PLAN_NOT_FOUND,
      );
    }

    // 4. Obtener los IDs de las materias aprobadas del plan viejo
    const approvedOldSubjectIds = approvedSubjects.map(
      subj => subj.approvedSubjectVersionId,
    );

    // 5. Generar array de semestres desde 1 hasta el semestre actual del estudiante
    const semestersToConsider = Array.from(
      { length: studentSemester },
      (_, i) => i + 1,
    );

    // 6. Obtener TODAS las materias del plan viejo hasta el semestre actual del estudiante
    const allOldSubjectsUpToSemester = await this.subjectVersionRepository.find(
      {
        where: {
          plan: { id: oldPlan.id },
          semester: In(semestersToConsider),
        },
        relations: ['area', 'plan'],
      },
    );

    // 7. Identificar las materias del plan viejo que NO aprobó hasta su semestre actual
    const approvedOldSubjectIdsSet = new Set(approvedOldSubjectIds);
    const notApprovedOldSubjects = allOldSubjectsUpToSemester.filter(
      subject => !approvedOldSubjectIdsSet.has(subject.id),
    );

    // 8. Si no hay materias no aprobadas, retornar array vacío
    if (notApprovedOldSubjects.length === 0) {
      return [];
    }

    // 9. Para cada materia no aprobada, buscar su equivalente en el plan nuevo
    const equivalencesForNotApproved = await this.equivalenceRepository.find({
      where: {
        oldSubjectVersionId: In(notApprovedOldSubjects.map(s => s.id)),
      },
    });

    // 10. Obtener los IDs de las materias nuevas que equivalen a las no aprobadas
    const newSubjectsToViewIds = [
      ...new Set(equivalencesForNotApproved.map(eq => eq.newSubjectVersionId)),
    ];

    // 11. Si no hay equivalencias, retornar array vacío
    if (newSubjectsToViewIds.length === 0) {
      return [];
    }

    // 12. Obtener las materias nuevas que debe ver
    const subjectsToView = await this.subjectVersionRepository.find({
      where: {
        id: In(newSubjectsToViewIds),
        plan: { id: newPlan.id },
      },
      relations: ['area', 'plan'],
    });

    // 13. Ordenar por semestre de menor a mayor (ascendente) para mostrar primero las del semestre actual
    return subjectsToView.sort((a, b) => a.semester - b.semester);
  }
}
