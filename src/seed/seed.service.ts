import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/user/constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HashAdapter } from 'src/common/interfaces/hash.interface';
import {
  Area,
  Equivalence,
  Plan,
  SubjectVersion,
} from 'src/curriculum/entities';
import { META_AREAS, META_PLANS } from 'src/curriculum/constants/meta-data';
import {
  EQUIVALENCE_DATA,
  NEW_SUBJECT_PLAN_DATA,
  OLD_SUBJECT_PLAN_DATA,
} from './constants';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(SubjectVersion)
    private readonly subjectRepository: Repository<SubjectVersion>,
    @InjectRepository(Equivalence)
    private readonly equivalenceRepository: Repository<Equivalence>,
    private readonly configService: ConfigService,
    @Inject('HashAdapter')
    private readonly hasher: HashAdapter,
  ) {}

  async execute() {
    await this.adminSeed();
    await this.planSeed();
  }

  async adminSeed() {
    const existAdmin = await this.validateExistUser();
    if (existAdmin) return;

    this.logger.log('CREANDO USUARIO ADMINISTADOR....');

    const fullName = this.configService.get<string>('ADMIN_NAME');

    const password = this.configService.get<string>('ADMIN_PASSWORD');

    const passwordEncrypted = await this.hasher.hash(password!);

    const userName = this.configService.get<string>('ADMIN_USERNAME');

    const email = this.configService.get<string>('ADMIN_EMAIL');

    const newUser = this.userRepository.create({
      fullName,
      password: passwordEncrypted,
      userName,
      email,
      role: ROLE.ADMIN,
    });
    await this.userRepository.save(newUser);
    this.logger.log('USUARIO ADMINISTRADOR CREADO');
  }

  async planSeed() {
    //Crear los planes de asignatura
    const existSubjectPlan = await this.validateIfSubjectPlanExist();
    if (existSubjectPlan.length > 0) return;
    this.logger.log('CREANDO PLANES DE ASIGNATURA...');
    const oldSubjectPlan = await this.createOldSubjectPlan();
    const newSubjectPlan = await this.createNewSubjectPlan();
    await this.createAreas();

    const allSubjects = await this.createSubjectsVersion(
      oldSubjectPlan,
      newSubjectPlan,
    );
    await this.createRulesForHomologations(allSubjects);

    this.logger.log('PLANES DE ASIGNATURA CREADOS.');
  }

  private async createOldSubjectPlan() {
    return await this.planRepository.save(
      this.planRepository.create({
        name: META_PLANS.OLD_SUBJECT_PLAN,
        startDate: new Date('2019-01-01'),
      }),
    );
  }

  private async createNewSubjectPlan() {
    return await this.planRepository.save(
      this.planRepository.create({
        name: META_PLANS.NEW_SUBJECT_PLAN,
        startDate: new Date('2025-01-01'),
      }),
    );
  }

  private async createAreas() {
    const META_AREAS_ARRAY = Object.values(META_AREAS);
    const areasEntities = await Promise.all(
      META_AREAS_ARRAY.map(async area => {
        const foundArea = await this.areaRepository.findOne({
          where: { name: area },
        });
        if (foundArea) return foundArea;
        return this.areaRepository.create({ name: area });
      }),
    );
    await this.areaRepository.save(areasEntities);
  }

  private async createSubjectsVersion(oldPlan: Plan, newPlan: Plan) {
    const foundAreas = await this.areaRepository.find();

    const oldSubjects = await Promise.all(
      OLD_SUBJECT_PLAN_DATA.map(async ({ name, semester, credits, area }) => {
        const foundArea = foundAreas.find(
          index => index.name === (area as string),
        );
        if (!foundArea)
          throw new BadRequestException('No hay area para esta asignatura');
        return await this.subjectRepository.save(
          this.subjectRepository.create({
            name,
            semester,
            credits,
            area: { id: foundArea.id },
            plan: { id: oldPlan.id },
          }),
        );
      }),
    );

    const newSubjects = await Promise.all(
      NEW_SUBJECT_PLAN_DATA.map(async ({ name, semester, credits, area }) => {
        const foundArea = foundAreas.find(
          index => index.name === (area as string),
        );
        if (!foundArea)
          throw new BadRequestException('No hay area para esta asignatura');
        return await this.subjectRepository.save(
          this.subjectRepository.create({
            name,
            semester,
            credits,
            area: { id: foundArea.id },
            plan: { id: newPlan.id },
          }),
        );
      }),
    );

    return [...oldSubjects, ...newSubjects];
  }

  private async createRulesForHomologations(allSubjects: SubjectVersion[]) {
    this.logger.log('CREANDO REGLAS DE HOMOLOGACIÓN...');

    // 1. Mapear las materias por nombre para búsqueda rápida por nombre
    const subjectsMap = new Map<string, SubjectVersion>();
    allSubjects.forEach(sub => subjectsMap.set(sub.name, sub));

    const equivalencesToSave: Equivalence[] = [];

    for (const { oldName, newName } of EQUIVALENCE_DATA) {
      const oldSubject = subjectsMap.get(oldName);
      const newSubject = subjectsMap.get(newName);

      if (!oldSubject) {
        this.logger.warn(
          `[SKIP] Materia Vieja no encontrada en los datos: ${oldName}`,
        );
        continue;
      }
      if (!newSubject) {
        this.logger.warn(
          `[SKIP] Materia Nueva no encontrada en los datos: ${newName}`,
        );
        continue;
      } // 2. Crear la entidad Equivalence con los IDs

      const equivalenceEntity = this.equivalenceRepository.create({
        oldSubjectVersionId: oldSubject.id,
        newSubjectVersionId: newSubject.id,
      });
      equivalencesToSave.push(equivalenceEntity);
    } // 3. Insertar en lote

    await this.equivalenceRepository.save(equivalencesToSave);
    this.logger.log(
      `SE CREARON ${equivalencesToSave.length} REGLAS DE HOMOLOGACIÓN.`,
    );
  }

  private async validateExistUser() {
    const existOtherAdmin = await this.userRepository.findOne({
      where: { role: ROLE.ADMIN },
    });
    return existOtherAdmin ? true : false;
  }

  private async validateIfSubjectPlanExist() {
    return await this.planRepository.find({
      where: [
        { name: META_PLANS.OLD_SUBJECT_PLAN },
        { name: META_PLANS.NEW_SUBJECT_PLAN },
      ],
    });
  }
}
