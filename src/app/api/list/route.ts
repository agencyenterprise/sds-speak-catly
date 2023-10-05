import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { Item } from '@prisma/client'

export async function POST(req: NextRequest) {
  const { title, userId, items } = await req.json();

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
  })

  return NextResponse.json({ status: 201, data: newList })
}

