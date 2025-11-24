import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/user/constants';
import { PlanService } from '../services/plan.service';

@Controller('plan')
@Auth(ROLE.ADMIN)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  findAll() {
    return this.planService.findAll();
  }
}
