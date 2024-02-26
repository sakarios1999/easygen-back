import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';
import { UserResponseType } from './types/userResponse.type';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  //Pipes to prevent data polution
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; userResponse: UserResponseType }> {
    this.logger.log('Received request to create user');

    try {
      const user = await this.usersService.createUser(createUserDto);
      this.logger.log('User created successfully');
      const userResponse = await this.usersService.buildUserResponse(user);
      return { message: 'User created successfully', userResponse };
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error;
    }
  }

  @Post('/login')
  //Pipes to prevent data polution
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; userResponse: UserResponseType }> {
    this.logger.log('Received request to login user');

    try {
      const user = await this.usersService.loginUser(loginDto);
      this.logger.log('User successfully signed in');
      const userResponse = await this.usersService.buildUserResponse(user);
      return { message: 'User successfully signed in', userResponse };
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw error;
    }
  }
}
