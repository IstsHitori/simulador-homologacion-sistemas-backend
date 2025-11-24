import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plan, SubjectVersion } from '../entities';
import { META_PLANS, PLAN_ERRORS_MESSAGES, PlansMapped } from '../constants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(SubjectVersion)
    private readonly subjectVersionRepository: Repository<SubjectVersion>,
  ) {}

  async findAll(): Promise<PlansMapped> {
    const oldPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.OLD_SUBJECT_PLAN },
    });
    const newPlan = await this.planRepository.findOne({
      where: { name: META_PLANS.NEW_SUBJECT_PLAN },
    });

    if (!oldPlan || !newPlan)
      throw new NotFoundException(PLAN_ERRORS_MESSAGES.PLANS_NOT_FOUND);

    const oldSubjects = await this.subjectVersionRepository.find({
      where: { plan: { name: oldPlan.name } },
      relations: ['area'],
    });

    const newSubjects = await this.subjectVersionRepository.find({
      where: { plan: { name: newPlan.name } },
      relations: ['area'],
    });

    return {
      oldPlan: {
        plan: oldPlan,
        subjects: oldSubjects,
        quantity: oldSubjects.length,
      },
      newPlan: {
        plan: newPlan,
        subjects: newSubjects,
        quantity: newSubjects.length,
      },
    };
  }
}
