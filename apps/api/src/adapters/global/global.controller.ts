import { Controller, Get } from "@nestjs/common";


@Controller()
export class GlobalController {

  @Get()
  index() {
    return {
      message: 'Welcome to the API'
    }
  }

}