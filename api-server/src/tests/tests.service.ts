import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create a new test with parts and questions
   */
  async create(createTestDto: CreateTestDto) {
    const { parts, ...testData } = createTestDto;

    return this.prisma.test.create({
      data: {
        ...testData,
        parts: {
          create: parts.map((part) => ({
            partNumber: part.partNumber,
            questions: {
              create: part.questions.map((q) => ({
                content: q.content,
                options: q.options,
                correctOpt: q.correctOpt,
                explanation: q.explanation,
                imageUrl: q.imageUrl,
                audioUrl: q.audioUrl,
                transcript: q.transcript,
              })),
            },
          })),
        },
      },
      include: {
        parts: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  /**
   * Get all tests with parts
   */
  async findAll() {
    return this.prisma.test.findMany({
      include: {
        parts: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a single test by ID
   */
  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        parts: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    return test;
  }

  /**
   * Update test metadata (title, type, duration)
   */
  async update(id: string, updateTestDto: UpdateTestDto) {
    // Check if test exists
    await this.findOne(id);

    return this.prisma.test.update({
      where: { id },
      data: updateTestDto,
      include: {
        parts: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  /**
   * Delete test (cascades to parts and questions)
   */
  async remove(id: string) {
    // Check if test exists
    await this.findOne(id);

    await this.prisma.test.delete({
      where: { id },
    });

    return { message: 'Test deleted successfully' };
  }
}
