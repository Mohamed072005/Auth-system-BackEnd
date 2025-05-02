import { Body, Controller, Get, HttpStatus, Inject, Post, Request, Response, UseInterceptors } from '@nestjs/common';
import { RegisterDto } from './DTOs/register.dto';
import { AuthServiceInterface } from './interfaces/service/auth.service.interface';
import { RegisterResponseDto } from './DTOs/register.response.dto';
import { CustomValidation } from '../../common/decorators/custom-validation.filter';
import { LoginDto } from './DTOs/login.dto';
import { LoginResponseDto } from './DTOs/login.response.dto';
import { GetUserInfo } from '../../common/decorators/get-user-info.decorator';
import { UserInfo } from '../../common/types/user-info.type';
import { ClearRefreshTokenInterceptor } from '../../common/interceptors/clear-refresh-token.interceptor';

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

  @Post('/login')
  @CustomValidation()
  async login(@Body() loginRequest: LoginDto): Promise<LoginResponseDto> {
    const response = await this.authService.handleLogin(loginRequest);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: response.message,
      access_token: response.access_token,
    };
  }

  @Get('/refresh')
  @UseInterceptors(ClearRefreshTokenInterceptor)
  async refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res,
    @GetUserInfo() userInfo: UserInfo,
  ) {
    const refreshToken = req.cookies['refresh_token'];
  }
}
