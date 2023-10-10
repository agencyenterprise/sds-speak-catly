import { ListWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { atom } from 'recoil'

export const ListsAtom = atom<ListWithItemsAndMetrics[]>({
  key: 'ListsAtom',
  default: [],
})
