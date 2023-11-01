import { ItemsWithMetrics, SetWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { atom } from 'recoil'

export const CurrentActiveSet = atom<SetWithItemsAndMetrics | null>({
  key: 'CurrentActiveSet',
  default: null,
})
