import { Item, Set, UserPronunciationMetrics } from '@prisma/client'

export interface ItemsWithMetrics extends Item {
  userPronunciationMetrics?: UserPronunciationMetrics
}

export interface SetWithItemsAndMetrics extends Set {
  items: ItemsWithMetrics[]
}
