import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { Item, Set, User, UserPronunciationMetrics } from '@prisma/client'

export interface GetAllUserSet extends Set {
  items: Array<
    Item & { score: number; userPronunciationMetrics: UserPronunciationMetrics }
  >
  createdBy: User
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params

  const allUserSets = await prisma.set.findMany({
    where: {
      createdBy: {
        id: userId,
      },
    },
    select: {
      id: true,
      title: true,
      items: {
        include: {
          userPronunciationMetrics: {
            select: {
              spellingMetrics: true,
            },
          },
        },
      },
      createdBy: true,
    },
  })

  return NextResponse.json({ status: 201, data: allUserSets })
}
