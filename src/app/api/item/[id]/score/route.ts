import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json()

  const item = await prisma.item.update({
    where: { id: params.id },
    data: { score: body.score, concludedAt: new Date() },
  })

  return NextResponse.json({ status: 200, data: item })
}
