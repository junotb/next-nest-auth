import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      const connectSpy = jest.spyOn(prismaService, '$connect');
      await prismaService.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('enableShutdownHooks', () => {
    it('should call $disconnect', async () => {
      const disconnectSpy = jest.spyOn(prismaService, '$disconnect');
      await prismaService.enableShutdownHooks();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});