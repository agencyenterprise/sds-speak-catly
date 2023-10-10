import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
  })

  return NextResponse.json({ status: 200, data: item })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json()

  const item = await prisma.item.update({
    where: { id: params.id },
    data: { text: body?.text },
  })

  return NextResponse.json({ status: 200, data: item })
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const item = await prisma.item.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ status: 200, data: item })
}
