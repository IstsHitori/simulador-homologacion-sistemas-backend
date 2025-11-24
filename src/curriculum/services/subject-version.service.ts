import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SubjectVersion } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SUBJECT_ERROR_MESSAGES } from '../constants';

@Injectable()
export class SubjectVersionService {
  constructor(
    @InjectRepository(SubjectVersion)
    private readonly subjectVersionRepo: Repository<SubjectVersion>,
  ) {}

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
