import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ unique: true })
  nombre_rol: string; // 'admin', 'vendedor', 'transporte', 'cliente'

  @OneToMany(() => User, (user) => user.rol)
  usuarios: User[];
}