import { SetWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { SetsAtom } from '@/atoms/SetsAtom'
import { Set } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRecoilValue } from 'recoil'

export const useHandleSet = () => {
  const sets = useRecoilValue(SetsAtom)

  async function handleCreateSet(userId?: string, title?: string) {
    if (!userId) return
    if (!title) return

    const { data } = await axios.post<AxiosResponse<SetWithItemsAndMetrics>>(
      `/api/set`,
      {
        title,
        userId,
        items: [],
      },
    )

    return data.data
  }

  async function handleGetSet(userId: string) {
    const { data } = await axios.get(`/api/set/user/${userId}`)

    return data.data
  }

  async function handleEditSet(setId: string, title: string) {
    const { data } = await axios.patch<AxiosResponse<Set>>(
      `/api/set/${setId}`,
      {
        title,
      },
    )
    const updatedSet = sets.map((set) => {
      if (set.id === setId) {
        return {
          ...set,
          ...data.data,
        }
      }
      return set
    })

    return updatedSet
  }

  async function handleRemoveSet(setId: string) {
    await axios.delete(`/api/set/${setId}`)

    const updatedSet = sets.filter((set) => set.id !== setId)

    return updatedSet
  }

  return {
    handleCreateSet,
    handleGetSet,
    handleEditSet,
    handleRemoveSet,
  }
}
