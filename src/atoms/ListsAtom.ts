import { GetAllUserList } from '@/app/api/list/user/[userId]/route'
import { atom } from 'recoil'

export const ListsAtom = atom<GetAllUserList[]>({
  key: 'ListsAtom',
  default: [],
})
