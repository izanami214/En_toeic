import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) { }

  async create(createTestDto: CreateTestDto) {
    const { parts, ...testData } = createTestDto;

    return this.prisma.test.create({
      data: {
        ...testData,
        parts: {
          create: parts.map((part) => ({
            partNumber: part.partNumber,
            // Standalone questions (no passage)
            questions: {
              create: (part.questions || []).map((q, idx) => ({
                content: q.content,
                options: q.options,
                correctOpt: q.correctOpt,
                explanation: q.explanation,
                imageUrl: q.imageUrl,
                audioUrl: q.audioUrl,
                transcript: q.transcript,
                orderIndex: q.orderIndex ?? idx,
              })),
            },
            // Grouped questions with passage/audio
            groups: {
              create: (part.groups || []).map((g, gIdx) => ({
                title: g.title,
                passage: g.passage,
                imageUrl: g.imageUrl,
                audioUrl: g.audioUrl,
                orderIndex: g.orderIndex ?? gIdx,
                questions: {
                  create: (g.questions || []).map((q, qIdx) => ({
                    content: q.content,
                    options: q.options,
                    correctOpt: q.correctOpt,
                    explanation: q.explanation,
                    imageUrl: q.imageUrl,
                    audioUrl: q.audioUrl,
                    transcript: q.transcript,
                    orderIndex: q.orderIndex ?? qIdx,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: this.fullInclude(),
    });
  }

  async findAll() {
    return this.prisma.test.findMany({
      include: this.fullInclude(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: this.fullInclude(),
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    await this.findOne(id);

    return this.prisma.test.update({
      where: { id },
      data: updateTestDto,
      include: this.fullInclude(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.test.delete({ where: { id } });

    return { message: 'Test deleted successfully' };
  }

  /**
   * Shared include object so all queries return the same nested shape.
   * Part -> groups (with questions) + standalone questions, ordered.
   */
  private fullInclude() {
    return {
      parts: {
        orderBy: { partNumber: 'asc' as const },
        include: {
          questions: {
            where: { groupId: null }, // standalone only
            orderBy: { orderIndex: 'asc' as const },
          },
          groups: {
            orderBy: { orderIndex: 'asc' as const },
            include: {
              questions: {
                orderBy: { orderIndex: 'asc' as const },
              },
            },
          },
        },
      },
    };
  }
}
