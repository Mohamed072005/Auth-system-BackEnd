import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { RegisterDto } from './DTOs/register.dto';
import { AuthServiceInterface } from './interfaces/service/auth.service.interface';
import { RegisterResponseDto } from './DTOs/register.response.dto';
import { CustomValidation } from '../../common/decorators/custom-validation.filter';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Post('/register')
  @CustomValidation()
  async register(
    @Body() registerRequest: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const response = await this.authService.handleRegister(registerRequest);
    return {
      statusCode: HttpStatus.CREATED,
      message: response.message,
    };
  }
}
