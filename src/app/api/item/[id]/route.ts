import { prisma } from '@/lib/prisma/client';
import { NextRequest } from 'next/server';

export async function GET({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id }
  });

  return item;
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const item = await prisma.item.update({
    where: { id: params.id },
    data: { text: body.text }
  });

  return item;
}

export async function DELETE({ params }: { params: { id: string } }) {
  const item = await prisma.item.delete({
    where: { id: params.id }
  });

  return item;
}