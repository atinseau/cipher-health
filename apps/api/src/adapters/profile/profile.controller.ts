import { RedisService } from "@/common/redis/redis.service";
import { Controller, Get } from "@nestjs/common";

@Controller('profile')
export class ProfileController {

  constructor(
    private readonly redisService: RedisService,
  ) {}

  @Get('/me')
  async me() {
  
    
  }

}