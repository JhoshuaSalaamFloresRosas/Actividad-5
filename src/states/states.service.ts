import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, State } from '@prisma/client';

@Injectable()
export class StatesService {

  //instancia de prisma
  constructor(private prisma: PrismaService) {}
  /**
   * Funcion para buscar estado por nombre y sin importar acentos
   * @param name 
   * @returns 
   */
  async findByName(name: string): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: {
        OR: [
          { name: name },
          { name: { equals: name, mode: 'insensitive' } }
        ]
      },
    });
  }

  /**
   * Funcion para crear estado
   * @param data 
   * @returns 
   */
  async create(data: Prisma.StateCreateInput): Promise<State> {
    //Verificar si existe el estado
    const existingState = await this.findByName(data.name);
    if (existingState) {
      throw new NotFoundException('No se debe permitir crear un estado que ya exista');
    }
    
    return this.prisma.state.create({
      data,
    });
  }

  /**
   * Funcion para mostrar todos
   * @returns 
   */
  async findAll(): Promise<State[]> {
    return this.prisma.state.findMany();
  }

  /**
   * Funcion para buscar si existe el estado
   * @param id 
   * @returns 
   */
  async byId(id: number): Promise<State> {
    const project = await this.prisma.state.findUnique({
      where:{
        id
      }
    });

    if(!project){
      throw new NotFoundException('Proyecto no encontrado')
    }

    return project;
  }

  /**
   * Funcion para mostrar un estado con sus ciudades
   * @param id 
   * @returns 
   */
  async findOne(id: number): Promise<State> {
    const project = await this.prisma.state.findUnique({
      where:{
        id
      },
      include: {
        cities: true
      }
    });

    if(!project){
      throw new NotFoundException('Estado no encontrado')
    }

    return project;
  }

  async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
    // validar que el estado existe
    await this.byId(id);
    // validar que el nombre no exista
    const existingState = await this.findByName(updateStateDto.name);
    // Si existe un estado con el nombre proporcionado
    if (existingState) {
      throw new NotFoundException('Ese estado ya existe');
    }
    
    
    return this.prisma.state.update({
      data: updateStateDto,
      where: {
        id
      }
    });
  }

  async remove(id: number): Promise<State> {
    // Validar que el estado existe
    await this.byId(id);   
    // Eliminar de la base de datos
    return this.prisma.state.delete({
      where: {
        id
      }
    });
  }
}  
