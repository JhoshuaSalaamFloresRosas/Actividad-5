import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Address } from '@prisma/client';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Función para buscar una dirección por ID
   * @param id
   * @returns
   */
  async byId(id: number): Promise<Address> {
    const address = await this.prisma.address.findUnique({
      where: {
        id
      },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    return address;
  }

  /**
   * Función para crear una nueva dirección
   * @param createAddressDto
   * @returns
   */
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { street, outNum, intNum, zipCode, clientId, locationId } = createAddressDto;

    return this.prisma.address.create({
      data: {
        street,
        outNum,
        intNum,
        zipCode,
        client: {
          connect: {
            id: clientId,
          },
        },
        location: {
          connect: {
            id: locationId,
          },
        },
      },
    });
  }

  /**
   * Función para mostrar todas las direcciones
   * @returns
   */
  async findAll(): Promise<Address[]> {
    return this.prisma.address.findMany();
  }

  /**
   * Función para buscar una dirección por ID, incluyendo relaciones
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Address> {
    const address = await this.prisma.address.findUnique({
      where: {
        id
      },
      include: {
        client: true,
        location: {
          include: {
            city: {
              include: {
                state: true
              }
            }
          }
        }
      },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    return address;
  }

  /**
   * Función para actualizar una dirección
   * @param id
   * @param updateAddressDto
   * @returns
   */
  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    // Validar que la dirección existe
    await this.byId(id);

    return this.prisma.address.update({
      data: updateAddressDto,
      where: {
        id
      }
    });
  }

  /**
   * Función para eliminar una dirección
   * @param id
   * @returns
   */
  async remove(id: number): Promise<Address> {
    // Validar que la dirección existe
    await this.byId(id);

    return this.prisma.address.delete({
      where: {
        id
      }
    });
  }
}
