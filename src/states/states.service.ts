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
   * Normaliza una cadena eliminando acentos y convirtiendo a minúsculas.
   * @param str 
   * @returns 
   */
 normalizeString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Función para buscar estado por nombre y sin importar acentos
 * @param name 
 * @returns 
 */
async findByName(name: string): Promise<State | null> {
  const normalized_name = this.normalizeString(name);

  const states = await this.prisma.state.findMany({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { name: { equals: normalized_name, mode: 'insensitive' } }
      ]
    }
  });

  return states.find(state => this.normalizeString(state.name) === normalized_name) || null;
}

/**
 * Función para crear estado
 * @param data 
 * @returns 
 */
async create(data: Prisma.StateCreateInput): Promise<State> {
  const normalized_name = this.normalizeString(data.name);

  // Verificar si existe el estado
  const existingState = await this.findByName(normalized_name);
  if (existingState) {
    throw new NotFoundException('Ese estado ya existe');
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

    /**
   * Función para actualizar un estado
   * @param id 
   * @param updateStateDto 
   * @returns 
   */
    async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
      // Validar que el estado existe
      const state = await this.byId(id);
    
      // Validar que el nombre no exista
      if (updateStateDto.name) {
        const normalized_name = this.normalizeString(updateStateDto.name);
        const existingState = await this.findByName(normalized_name);
        // Si existe un estado con el nombre proporcionado y su id es diferente al del estado que se está actualizando
        if (existingState && existingState.id !== id) {
          throw new NotFoundException('Ese estado ya existe');
        }
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
