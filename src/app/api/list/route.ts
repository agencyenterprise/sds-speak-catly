import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { Item } from '@prisma/client'

export async function POST(req: NextRequest) {
  const { title, userId, items } = await req.json()

  const newList = await prisma.list.create({
    data: {
      title,
      createdBy: {
        connect: { id: userId },
      },
      items: {
        create: items.map((item: Item) => ({
          text: item.text,
          createdAt: new Date(),
        })),
      },
    },
    select: {
      id: true,
      title: true,
      items: {
        select: {
          id: true,
          text: true,
          createdAt: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return NextResponse.json({ status: 201, data: newList })
}
