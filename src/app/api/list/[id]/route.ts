import { prisma } from '@/lib/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET({ params }: { params: { id: string } }) {
  const item = await prisma.list.findUnique({
    where: { id: params.id }
  });

  return NextResponse.json({ status: 200, data: item })
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const item = await prisma.list.update({
    where: { id: params.id },
    data: { description: body.description }
  });

  return NextResponse.json({ status: 200, data: item })

}

export async function DELETE({ params }: { params: { id: string } }) {
  const item = await prisma.list.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ status: 200, data: item })
}