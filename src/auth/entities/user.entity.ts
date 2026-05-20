import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  @Exclude() // No expone contraseña en respuestas
  password: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @CreateDateColumn()
  fecha_registro: Date;
}