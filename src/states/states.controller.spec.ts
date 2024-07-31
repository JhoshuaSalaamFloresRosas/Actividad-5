import { Test, TestingModule } from '@nestjs/testing';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { PrismaService } from '../prisma.service';


describe('StatesController', () => {
  let controller: StatesController;
  let service: StatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatesController],
      providers: [StatesService, PrismaService],
    }).compile();

    // obtener instancia de controller
    controller = module.get<StatesController>(StatesController);

    // obtener instancia de servicio
    service = module.get<StatesService>(StatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Interacción Controlador - Servicio', () => {
    it('Debe traer un state por id', async () => {
      let result = {
        id: 1,
        name: 'Puebla',
        cities: [],
      };

      // Simulación de ejecución del método findOne(n)
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });
});
