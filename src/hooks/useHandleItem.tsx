import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { SetsAtom } from '@/atoms/SetsAtom'
import { Item, SpellingMetrics } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRecoilValue } from 'recoil'

export const useHandleItem = () => {
  const sets = useRecoilValue(SetsAtom)
  async function handleCreateItem(setId: string, text: string) {
    const { data } = await axios.post<AxiosResponse<ItemsWithMetrics>>(
      '/api/item',
      {
        text,
        setId,
      },
    )
    const foundSet = sets.find((oldSet) => oldSet.id === setId)
    const newSet = sets.map((oldSet) => {
      if (foundSet) {
        if (oldSet.id === setId) {
          return {
            ...oldSet,
            items: [...oldSet.items, data.data],
          }
        }
      }
      return oldSet
    })

    return newSet
  }

  async function handleItemEdit(itemId: string, setId: string, text: string) {
    const { data } = await axios.patch<AxiosResponse<Item>>(
      `/api/item/${itemId}`,
      {
        text,
      },
    )

    const newItem = data.data

    return sets.map((set) => {
      if (set.id === setId) {
        return {
          ...set,
          items: [
            ...set.items.map((oldItem) => {
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
      return set
    })
  }

  async function handleItemRemove(setId: string, itemId: string) {
    await axios.delete<AxiosResponse<Item>>(`/api/item/${itemId}`)
    return sets.map((set) => {
      if (set.id === setId) {
        return {
          ...set,
          items: [
            ...set.items.filter((item) => {
              return item.id !== itemId
            }),
          ],
        }
      }
      return set
    })
  }

  interface UpdateSpellingMetrics {
    setId: string
    itemId: string
    userId: string
    spellingMetrics: SpellingMetrics
  }

  async function updateSpellingMetrics({
    setId,
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

    const updatedSet = sets.map((set) => {
      if (set.id === setId) {
        return {
          ...set,
          items: [
            ...set.items.map((prevItem) => {
              if (prevItem.id === itemId) {
                return data.data
              }
              return prevItem
            }),
          ],
        }
      }
      return set
    })
    return updatedSet
  }

  return {
    handleCreateItem,
    handleItemEdit,
    handleItemRemove,
    updateSpellingMetrics,
  }
}
