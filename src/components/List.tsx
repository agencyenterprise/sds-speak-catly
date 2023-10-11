'use client'
import {
  ItemsWithMetrics,
  ListWithItemsAndMetrics,
} from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import ListItemComponent from '@/components/ListItem'
import { PlusIcon } from '@heroicons/react/20/solid'
import { List } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { useRef, useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useSetRecoilState } from 'recoil'

export default function ListComponent({
  list,
}: {
  list: ListWithItemsAndMetrics
}) {
  const setLists = useSetRecoilState(ListsAtom)
  const [isCreating, setIsCreating] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  async function handleCreateItem() {
    if (!textAreaRef.current?.value) return

    setIsCreating(false)

    const { data } = await axios.post<AxiosResponse<ItemsWithMetrics>>(
      '/api/item',
      {
        text: textAreaRef.current.value,
        listId: list.id,
      },
    )

    setLists((oldLists) => {
      const foundList = oldLists.find((oldList) => oldList.id === list.id)
      if (foundList) {
        return oldLists.map((oldList) => {
          if (oldList.id === list.id) {
            return {
              ...oldList,
              items: [...oldList.items, data.data],
            }
          }
          return oldList
        })
      }

      return oldLists
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
    setLists((oldLists) => {
      const newList = oldLists.filter((list) => list.id !== listId)
      return [...newList]
    })
    await axios.delete(`/api/list/${listId}`)
  }
  function handleReturn(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      handleCreateItem()
    }
  }

  function CreatingLine() {
    if (!isCreating) {
      return (
        <li
          key={'CREATE_NEW' + list.id}
          className='flex flex-row items-center justify-end gap-x-4 rounded bg-slate-50 px-3 py-2'
          onClick={() => setIsCreating(true)}
        >
          <button className='flex items-center rounded-full border border-primary-500 bg-transparent px-3 py-1 font-bold text-primary-500 hover:bg-primary-500 hover:text-white'>
            <span className='mr-1 h-5 w-5'>
              <PlusIcon />
            </span>
            Add to List
          </button>
        </li>
      )
    }

    return (
      <li
        key={'CREATE_NEW' + list.id}
        className='flex flex-row items-center justify-end gap-x-4 rounded bg-slate-50 px-3 py-2'
      >
        <textarea
          className='input w-1/2 leading-[0.95rem]'
          placeholder='Enter the text...'
          autoFocus
          rows={1}
          ref={textAreaRef}
          onKeyDown={handleReturn}
        />
        <div className='flex flex-row items-center gap-2'>
          <span
            onClick={handleCreateItem}
            className='cursor-pointer text-2xl text-green-500'
          >
            <FaCheck />
          </span>
          <span
            className='cursor-pointer text-xl text-red-500'
            onClick={() => setIsCreating(false)}
          >
            <FaX />
          </span>
        </div>
      </li>
    )
  }

  return (
    <div key={list.id} className='relative min-w-[25%] max-w-[33%] flex-grow '>
      <div className='top-0 z-10 flex justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-3 '>
        <h3 className='text-md font-semibold leading-6 text-white'>
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
        <CreatingLine />
      </ul>
    </div>
  )
}
