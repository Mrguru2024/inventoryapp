import { withRoleCheck } from '@/lib/api/withRoleCheck';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handler(req: Request) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return Response.json(users);
}

export const GET = withRoleCheck(handler, ['ADMIN']); 