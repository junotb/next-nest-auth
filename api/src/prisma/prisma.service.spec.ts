import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    prismaService.$connect = jest.fn();
    prismaService.$disconnect = jest.fn();
  });

  it("PrismaService가 정의되어야 합니다", () => {
    expect(prismaService).toBeDefined();
  });

  describe("onModuleInit", () => {
    it("onModuleInit() 메서드는 $connect를 호출해야 합니다", async () => {
      await prismaService.onModuleInit();
      expect(prismaService.$connect).toHaveBeenCalled();
    });
  });

  describe("enableShutdownHooks", () => {
    it("enableShutdownHooks() 메서드는 $disconnect를 호출해야 합니다", async () => {
      await prismaService.enableShutdownHooks();
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 mock 초기화
  });  
});