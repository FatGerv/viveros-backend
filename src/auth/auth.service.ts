import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Validar que el correo no exista
    const existing = await this.usersRepository.findOne({
      where: { correo: createUserDto.correo },
    });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Obtener o crear el rol
    let role = await this.rolesRepository.findOne({
      where: { nombre_rol: createUserDto.rol },
    });
    if (!role) {
      role = this.rolesRepository.create({ nombre_rol: createUserDto.rol });
      await this.rolesRepository.save(role);
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear usuario
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      rol: role,
    });

    const savedUser = await this.usersRepository.save(user);

    // Retornar usuario sin contraseña y rol simplificado
    const { password, rol, ...userWithoutPassword } = savedUser;
    return {
      user: {
        ...userWithoutPassword,
        rol: savedUser.rol.nombre_rol,
      },
      message: 'Registro exitoso. Por favor, inicia sesión.',
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario por correo
    const user = await this.usersRepository.findOne({
      where: { correo: loginDto.correo },
      relations: ['rol'],
    });

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Generar JWT
    const payload = {
      sub: user.id_usuario,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol.nombre_rol,
    };

    const access_token = this.jwtService.sign(payload);

    // Retornar usuario sin contraseña y rol simplificado
    const { password, rol, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        rol: user.rol.nombre_rol, // Solo el nombre del rol, no el objeto completo
      },
      access_token,
      message: `Bienvenido, ${user.nombre}`,
    };
  }
}