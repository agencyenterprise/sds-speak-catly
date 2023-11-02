import { SetWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { atom } from 'recoil'

export const SetsAtom = atom<SetWithItemsAndMetrics[]>({
  key: 'SetsAtom',
  default: [],
})
