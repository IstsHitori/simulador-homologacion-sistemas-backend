import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SubjectVersion } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ISubjectsMapped,
  META_PLANS,
  SUBJECT_ERROR_MESSAGES,
} from '../constants';

@Injectable()
export class SubjectVersionService {
  constructor(
    @InjectRepository(SubjectVersion)
    private readonly subjectVersionRepo: Repository<SubjectVersion>,
  ) {}

  async findAll(): Promise<ISubjectsMapped> {
    const oldSubjects = await this.subjectVersionRepo.find({
      where: { plan: { name: META_PLANS.OLD_SUBJECT_PLAN } },
      relations: ['plan'],
    });
    const oldSubjectsQuantity = oldSubjects.length;

    const newSubjects = await this.subjectVersionRepo.find({
      where: { plan: { name: META_PLANS.NEW_SUBJECT_PLAN } },
      relations: ['plan'],
    });

    const newSubjectsQuantity = newSubjects.length;

    return {
      oldSubjects,
      oldSubjectsQuantity,
      newSubjects,
      newSubjectsQuantity,
    };
  }

  async findOne(id: number) {
    const foundSubjectVersion = await this.subjectVersionRepo.findOne({
      where: { id },
    });
    if (!foundSubjectVersion)
      throw new NotFoundException(
        SUBJECT_ERROR_MESSAGES.SUBJECT_VERSION_NOT_FOUND,
      );
    return foundSubjectVersion;
  }

  async getSubjectVersionsByIds(
    subjectIds: string[],
  ): Promise<SubjectVersion[]> {
    if (subjectIds.length === 0) return [];

    const uniqueIds = [...new Set(subjectIds)];

    return this.subjectVersionRepo.find({
      where: { id: In(uniqueIds) },
      relations: ['plan', 'area'],
    });
  }
}
