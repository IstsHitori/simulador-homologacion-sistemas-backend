import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
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
}
