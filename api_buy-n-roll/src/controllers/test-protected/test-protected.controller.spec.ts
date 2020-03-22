import { Test, TestingModule } from '@nestjs/testing';
import { TestProtectedController } from './test-protected.controller';

describe('TestProtected Controller', () => {
  let controller: TestProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestProtectedController],
    }).compile();

    controller = module.get<TestProtectedController>(TestProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
