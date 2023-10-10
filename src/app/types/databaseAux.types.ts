import { Item, List, UserPronunciationMetrics } from '@prisma/client'

export interface ItemsWithMetrics extends Item {
  userPronunciationMetrics?: UserPronunciationMetrics
}

export interface ListWithItemsAndMetrics extends List {
  items: ItemsWithMetrics[]
}
