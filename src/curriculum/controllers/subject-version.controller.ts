import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/user/constants';
import { SubjectVersionService } from '../services/subject-version.service';

@Controller('subject-version')
@Auth(ROLE.ADMIN)
export class SubjectVersionController {
  constructor(private readonly subjectVersionService: SubjectVersionService) {}

  @Get()
  findAll() {
    return this.subjectVersionService.findAll();
  }
}
