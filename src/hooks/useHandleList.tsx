import { ListWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import { List } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRecoilValue } from 'recoil'

export const useHandleList = () => {
  const lists = useRecoilValue(ListsAtom)

  async function handleCreateList(userId?: string, title?: string) {
    if (!userId) return
    if (!title) return

    const { data } = await axios.post<AxiosResponse<ListWithItemsAndMetrics>>(
      `/api/list`,
      {
        title,
        userId,
        items: [],
      },
    )

    return data.data
  }

  async function handleGetList(userId: string) {
    const { data } = await axios.get(`/api/list/user/${userId}`)

    return data.data
  }

  async function handleListEdit(listId: string, title: string) {
    const { data } = await axios.patch<AxiosResponse<List>>(
      `/api/list/${listId}`,
      {
        title,
      },
    )
    const updatedList = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          ...data.data,
        }
      }
      return list
    })

    return updatedList
  }

  async function handleListRemove(listId: string) {
    await axios.delete(`/api/list/${listId}`)

    const updatedList = lists.filter((list) => list.id !== listId)

    return updatedList
  }

  return {
    handleCreateList,
    handleGetList,
    handleListEdit,
    handleListRemove,
  }
}
