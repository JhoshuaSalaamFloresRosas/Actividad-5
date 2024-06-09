import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, City } from '@prisma/client';

@Injectable()
export class CitiesService {
  // instancia de prisma
  constructor(private prisma: PrismaService) {}

  /**
   * Función para buscar ciudad por nombre y estado, sin importar acentos
   * @param name
   * @param stateId
   * @returns
   */
  async findByNameAndState(name: string, stateId: number): Promise<City | null> {
    return this.prisma.city.findFirst({
      where: {
        stateId: stateId,
        OR: [
          { name: name },
          { name: { equals: name, mode: 'insensitive' } }
        ]
      },
    });
  }

  /**
   * Función para crear una ciudad
   * @param createCityDto
   * @returns
   */
  async create(createCityDto: CreateCityDto): Promise<City> {
    const { name, stateId } = createCityDto;

    // Verificar si existe la ciudad en el estado
    const existingCity = await this.findByNameAndState(name, stateId);
    if (existingCity) {
      throw new NotFoundException('El municipio ya existe en el estado');
    }

    return this.prisma.city.create({
      data: {
        name,
        state: {
          connect: {
            id: stateId,
          },
        },
      },
    });
  }

  /**
   * Función para mostrar todas las ciudades
   * @returns
   */
  async findAll(): Promise<City[]> {
    return this.prisma.city.findMany();
  }

  /**
   * Función para buscar si existe la ciudad
   * @param id
   * @returns
   */
  async byId(id: number): Promise<City> {
    const city = await this.prisma.city.findUnique({
      where: {
        id
      }
    });

    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    return city;
  }

  /**
   * Función para mostrar una ciudad con sus localizaciones
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<City> {
    const city = await this.prisma.city.findUnique({
      where: {
        id
      },
      include: {
        locations: true
      }
    });

    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    return city;
  }

  /**
   * Funcion para actualizar una ciudad
   * @param id 
   * @param updateCityDto 
   * @returns 
   */

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    // Validar que la ciudad existe
    const city = await this.byId(id);

    // Validar que el nombre no exista en el mismo estado
    if (updateCityDto.name) {
      const existingCity = await this.findByNameAndState(updateCityDto.name, city.stateId);
      // Si existe una ciudad con el nombre proporcionado y su id es diferente al de la ciudad que se esta actualizando
      if (existingCity && existingCity.id !== id) {
        throw new NotFoundException('La ciudad ya existe en ese estado');
      }
    }

    return this.prisma.city.update({
      data: updateCityDto,
      where: {
        id
      }
    });
  }

  async remove(id: number): Promise<City> {
    // Validar que la ciudad existe
    await this.byId(id);
    
    // Eliminar de la base de datos
    return this.prisma.city.delete({
      where: {
        id
      }
    });
  }
}
