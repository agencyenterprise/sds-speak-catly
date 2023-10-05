import { prisma } from '@/lib/prisma/client';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, listId } = await req.json()

  const newItem = await prisma.item.create({
    data: {
      text,
      list: {
        connect: { id: listId },
      },
      createdAt: new Date()
    }
  });

  return NextResponse.json({ status: 201, data: newItem })

}

