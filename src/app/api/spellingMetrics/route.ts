import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId, spellingMetrics, itemId } = await req.json()

  const newMetrics = await prisma.userPronunciationMetrics.create({
    data: {
      userId,
      spellingMetrics,
      createdAt: new Date(),
    },
    include: {
      Item: true,
    },
  })

  const updatedItem = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      userPronunciationMetricsId: newMetrics.id,
    },
    include: {
      userPronunciationMetrics: true,
    },
  })

  return NextResponse.json({ status: 201, data: updatedItem })
}

export async function GET(
  _: NextRequest,
  { searchParams }: { searchParams: { userId: string; itemId: string } },
) {
  const { userId, itemId } = searchParams

  const metrics = await prisma.userPronunciationMetrics.findFirst({
    where: {
      userId,
    },
  })

  return NextResponse.json({ status: 200, data: metrics })
}
