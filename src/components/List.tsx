'use client'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Item, List } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRecoilState } from 'recoil'
import ListItemComponent from '@/components/ListItem'
import { GetAllUserList } from '@/app/api/list/user/[userId]/route'
import { ItemsWithMetrics } from '@/app/types/databaseAux.types'

export default function ListComponent() {
  const [lists, setLists] = useRecoilState(ListsAtom)

  async function handleCreateItem(listId: string) {
    const text = prompt('Enter the text of your item')
    if (!text) return

    const { data } = await axios.post<AxiosResponse<ItemsWithMetrics>>(
      '/api/item',
      {
        text,
        listId,
      },
    )

    setLists((oldLists) => {
      const list = oldLists.find((list) => list.id === listId)
      if (list) {
        return oldLists.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              items: [...list.items, data.data],
            }
          }
          return list
        })
      }

      return [...oldLists]
    })
  }

  async function handleListEdit(listId: string) {
    const newTitle = prompt('Enter the new title')
    if (!newTitle) return

    const { data } = await axios.patch<AxiosResponse<List>>(
      `/api/list/${listId}`,
      {
        title: newTitle,
      },
    )
    setLists((oldLists) => {
      return oldLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            ...data.data,
          }
        }
        return list
      })
    })
  }

  async function handleListRemove(listId: string) {
    await axios.delete(`/api/list/${listId}`)
    setLists((oldLists) => {
      const newList = oldLists.filter((list) => list.id !== listId)
      return [...newList]
    })
  }

  return (
    <div className='flex max-h-[89vh] flex-row flex-wrap gap-4'>
      {lists.map((list) => (
        <div
          key={list.id}
          className='relative mt-6 min-w-[25%] max-w-[33%] flex-grow '
        >
          <div className='sticky top-0 z-10 flex justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-blue-500 px-3 py-1.5 '>
            <h3 className='text-sm font-semibold leading-6 text-white'>
              {list.title}
            </h3>
            <ElipsisMenu
              handleEdit={() => handleListEdit(list.id)}
              handleRemove={() => handleListRemove(list.id)}
              color='white'
            />
          </div>
          <ul role='list' className='divide-y divide-gray-200'>
            {list.items?.map((item) => (
              <li key={item.id} className='bg-slate-50 px-3 py-2'>
                <ListItemComponent item={item} />
              </li>
            ))}
            <li
              key={'CREATE_NEW' + list.id}
              className='flex flex-row items-center justify-end gap-x-4 rounded bg-slate-50 px-3 py-2'
              onClick={() => handleCreateItem(list.id)}
            >
              <button className='flex items-center rounded-full border border-blue-500 bg-transparent px-3 py-1 font-bold text-blue-500 hover:bg-blue-500 hover:text-white'>
                <span className='mr-1 h-5 w-5'>
                  <PlusIcon />
                </span>
                Add to List
              </button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  )
}
