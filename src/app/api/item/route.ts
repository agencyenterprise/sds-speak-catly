import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, setId } = await req.json()

  const newItem = await prisma.item.create({
    data: {
      text,
      set: {
        connect: { id: setId },
      },
      createdAt: new Date(),
    },
    include: {
      userPronunciationMetrics: {
        select: {
          spellingMetrics: true,
        },
      },
    },
  })

  return NextResponse.json({ status: 201, data: newItem })
}
