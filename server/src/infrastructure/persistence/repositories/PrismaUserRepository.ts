import { PrismaClient } from '@prisma/client';
import { User, UserRepository } from '../../../domain/entities/User';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.userProfile.findUnique({ where: { email } });
  }

  async findByInitials(initials: string): Promise<User | null> {
    return this.prisma.userProfile.findFirst({ where: { initials } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.userProfile.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.userProfile.findMany({
      select: {
        id: true,
        name: true,
        initials: true,
        role: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.userProfile.create({
      data: user,
    });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return this.prisma.userProfile.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userProfile.delete({ where: { id } });
  }
}
