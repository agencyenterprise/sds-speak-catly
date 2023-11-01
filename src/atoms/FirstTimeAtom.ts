import { atom } from 'recoil'

interface FirstTime {
  createFirstSet: boolean
  openedSets: boolean
  createdFirstWord: boolean
  recordedFirstWord: boolean
}

export const FirstTimeAtom = atom<FirstTime>({
  key: 'FirstTimeAtom',
  default: {
    createFirstSet: false,
    openedSets: false,
    createdFirstWord: false,
    recordedFirstWord: false,
  },
})
