import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Location } from '@prisma/client';

@Injectable()
export class LocationsService {

  // instancia de prisma
  constructor(private prisma: PrismaService) {}

  /**
   * Función para buscar si existe la localidad por nombre y ciudad
   * @param name
   * @param cityId
   * @returns
   */
  private async findByNameAndCity(name: string, cityId: number): Promise<Location> {  
    return this.prisma.location.findFirst({
      where: {
        name,
        cityId: cityId,
        OR: [
          { name: name },
          { name: { equals: name, mode: 'insensitive' } }
        ]
      },
    });
  }

  /**
   * Método que crea una nueva localidad
   * @param createLocationDto
   * @returns
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { name, cityId } = createLocationDto;

    // Verificar si existe la localidad en la ciudad
    const existingLocation = await this.findByNameAndCity(name, cityId);
    if (existingLocation) {
      throw new NotFoundException('La localidad ya existe');
    }

    return this.prisma.location.create({
      data: {
        name,
        city: {
          connect: {
            id: cityId,
          },
        },
      },
    });
  }

  /**
   * Función para mostrar todas las localidades
   * @returns
   */
  async findAll(): Promise<Location[]> {
    return this.prisma.location.findMany();
  }

  /**
   * Función para buscar si existe la localidad por id
   * @param id
   * @returns
   */
  async byId(id: number): Promise<Location> {
    const location = await this.prisma.location.findUnique({
      where: {
        id
      }
    });

    if (!location) {
      throw new NotFoundException('Localidad no encontrada');
    }

    return location;
  }

  /**
   * Función para mostrar una localidad con su ciudad
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Location> {
    const location = await this.prisma.location.findUnique({
      where: {
        id
      },
      include: {
        city: true
      }
    });

    if (!location) {
      throw new NotFoundException('Localidad no encontrada');
    }

    return location;
  }

  /**
   * Funcion para actualizar una localidad
   * @param id 
   * @param updateLocationDto 
   * @returns 
   */
  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    // Validar que la localidad existe
    const location = await this.byId(id);

    // Validar que el nombre no exista en la misma ciudad
    if (updateLocationDto.name) {
      const existingLocation = await this.findByNameAndCity(updateLocationDto.name, location.cityId);
      // Si existe una localidad con el nombre proporcionado y su id es diferente al de la localidad que se esta actualizando
      if (existingLocation && existingLocation.id !== id) {
        throw new NotFoundException('La localidad ya existe en esa ciudad');
      }
    }

    return this.prisma.location.update({
      data: updateLocationDto,
      where: {
        id
      }
    });
  }

  // Función para eliminar
  async remove(id: number): Promise<Location> {
    // Validar que la localidad existe
    await this.byId(id);
    
    // Eliminar de la base de datos
    return this.prisma.location.delete({
      where: {
        id
      }
    });
  }
}