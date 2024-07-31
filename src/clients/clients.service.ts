import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Client } from '@prisma/client';

@Injectable()
export class ClientsService {

  // instancia de prisma
  constructor(private prisma: PrismaService) {}

  /**
   * Método que crea un nuevo cliente
   * @param createClientDto
   * @returns
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { name, lastName, RFC, email, phone } = createClientDto;

    // Crear el cliente en la base de datos
    return this.prisma.client.create({
      data: {
        name,
        lastName,
        RFC,
        email,
        phone,
        status: true, // Por defecto el estatus es activo
      },
    });
  }

  /**
   * Función para mostrar todos los clientes
   * @returns
   */
  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  /**
   * Función para buscar un cliente por id
   * @param id
   * @returns
   */
  async byId(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: {
        id
      }
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return client;
  }

  /**
   * Función para mostrar un cliente con su dirección
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: {
        id
      },
      include: {
        address: {
          include: {
            location: {
              include: {
                city: {
                  include: {
                    state: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return client;
  }

  /**
   * Funcion para actualizar un cliente
   * @param id 
   * @param updateClientDto 
   * @returns 
   */
  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    // Validar que el cliente existe
    const client = await this.byId(id);

    // Actualizar el cliente en la base de datos
    return this.prisma.client.update({
      data: updateClientDto,
      where: {
        id
      }
    });
  }

  // Función para eliminar
  async remove(id: number): Promise<Client> {
    // Validar que el cliente existe
    await this.byId(id);
    
    // Eliminar de la base de datos
    return this.prisma.client.delete({
      where: {
        id
      }
    });
  }
}
