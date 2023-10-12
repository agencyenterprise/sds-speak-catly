import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import { Item, SpellingMetrics } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRecoilValue } from 'recoil'

export const useHandleItem = () => {
  const lists = useRecoilValue(ListsAtom)
  async function handleCreateItem(listId: string, text: string) {
    const { data } = await axios.post<AxiosResponse<ItemsWithMetrics>>(
      '/api/item',
      {
        text,
        listId,
      },
    )
    const foundList = lists.find((oldList) => oldList.id === listId)
    const newList = lists.map((oldList) => {
      if (foundList) {
        if (oldList.id === listId) {
          return {
            ...oldList,
            items: [...oldList.items, data.data],
          }
        }
      }
      return oldList
    })

    return newList
  }

  async function handleItemEdit(itemId: string, listId: string, text: string) {
    const { data } = await axios.patch<AxiosResponse<Item>>(
      `/api/item/${itemId}`,
      {
        text,
      },
    )

    const newItem = data.data

    return lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: [
            ...list.items.map((oldItem) => {
              if (oldItem.id === itemId) {
                return {
                  ...oldItem,
                  text: newItem.text,
                }
              }
              return oldItem
            }),
          ],
        }
      }
      return list
    })
  }

  async function handleItemRemove(listId: string, itemId: string) {
    await axios.delete<AxiosResponse<Item>>(`/api/item/${itemId}`)
    return lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: [
            ...list.items.filter((item) => {
              return item.id !== itemId
            }),
          ],
        }
      }
      return list
    })
  }

  interface UpdateSpellingMetrics {
    listId: string
    itemId: string
    userId: string
    spellingMetrics: SpellingMetrics
  }

  async function updateSpellingMetrics({
    listId,
    itemId,
    userId,
    spellingMetrics,
  }: UpdateSpellingMetrics) {
    const { data } = await axios.post<AxiosResponse<ItemsWithMetrics>>(
      '/api/spellingMetrics',
      {
        spellingMetrics,
        userId,
        itemId,
      },
    )

    const updatedList = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: [
            ...list.items.map((prevItem) => {
              if (prevItem.id === itemId) {
                return data.data
              }
              return prevItem
            }),
          ],
        }
      }
      return list
    })
    return updatedList
  }

  return {
    handleCreateItem,
    handleItemEdit,
    handleItemRemove,
    updateSpellingMetrics,
  }
}
