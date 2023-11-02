import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET({ params }: { params: { id: string } }) {
  const item = await prisma.set.findUnique({
    where: { id: params.id },
  })

  return NextResponse.json({ status: 200, data: item })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json()

  const item = await prisma.set.update({
    where: { id: params.id },
    data: { title: body.title, description: body.description },
  })

  return NextResponse.json({ status: 200, data: item })
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const item = await prisma.set.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ status: 200, data: item })
}
