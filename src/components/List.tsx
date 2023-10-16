'use client'
import { ListWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import ListItem from '@/components/ListItem'
import { useHandleItem } from '@/hooks/useHandleItem'
import { useHandleList } from '@/hooks/useHandleList'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useRef, useState } from 'react'
import { FaCheck, FaSpellCheck, FaX } from 'react-icons/fa6'
import { useSetRecoilState } from 'recoil'

export default function ListComponent({
  list,
}: {
  list: ListWithItemsAndMetrics
}) {
  const setLists = useSetRecoilState(ListsAtom)
  const [isCreatingItem, setIsCreatingItem] = useState(false)
  const [isEditingList, setIsEditingList] = useState(false)
  const newItemRef = useRef<HTMLTextAreaElement>(null)
  const editingListRef = useRef<HTMLTextAreaElement>(null)

  const handleItem = useHandleItem()
  const handleList = useHandleList()

  async function handleCreateItem() {
    if (!newItemRef.current?.value) return

    const updatedList = await handleItem.handleCreateItem(
      list.id,
      newItemRef.current?.value,
    )

    setLists(updatedList)
    setIsCreatingItem(false)
  }

  async function handleEditList() {
    if (!editingListRef.current?.value) return

    setIsEditingList(false)
    const updatedList = await handleList.handleListEdit(
      list.id,
      editingListRef.current?.value,
    )

    setLists(updatedList)
  }

  async function handleListRemove(listId: string) {
    const updatedList = await handleList.handleListRemove(listId)
    setLists(updatedList)
  }

  function handleListEditReturn(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleEditList()
    }
  }

  function handleItemCreateReturn(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateItem()
    }
  }

  function CreatingLine() {
    if (!isCreatingItem) {
      return (
        <li
          className='flex flex-row items-center justify-end gap-x-4 rounded bg-slate-50 px-3 py-2'
          onClick={() => setIsCreatingItem(true)}
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
      <li className='flex flex-row items-center justify-end gap-x-4 rounded bg-slate-50 px-3 py-2'>
        <textarea
          className='input w-1/2 leading-[0.95rem]'
          placeholder='Word or phrase to test your speech...'
          autoFocus
          rows={1}
          ref={newItemRef}
          onKeyDown={handleItemCreateReturn}
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
            onClick={() => setIsCreatingItem(false)}
          >
            <FaX />
          </span>
        </div>
      </li>
    )
  }

  return (
    <div className='relative w-full flex-grow lg:w-[48%] xl:min-w-[25%] xl:max-w-[33%]'>
      {!isEditingList ? (
        <div className='top-0 z-10 flex justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-3 '>
          <h3 className='text-md font-semibold leading-6 text-white'>
            {list.title}
          </h3>
          <ElipsisMenu
            handleEdit={() => setIsEditingList(true)}
            handleRemove={() => handleListRemove(list.id)}
            color='white'
          />
        </div>
      ) : (
        <div className='top-0 z-10 flex gap-4 rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-1.5 '>
          <textarea
            className='input leading-[0.95rem]'
            placeholder='Enter the list title...'
            autoFocus
            defaultValue={list.title}
            rows={1}
            ref={editingListRef}
            onKeyDown={handleListEditReturn}
          />
          <div className='flex flex-row items-center gap-3 rounded-lg bg-white px-2'>
            <span
              onClick={handleEditList}
              className='cursor-pointer text-2xl text-green-500'
            >
              <FaCheck />
            </span>
            <span
              className='cursor-pointer text-xl text-red-500'
              onClick={() => setIsEditingList(false)}
            >
              <FaX />
            </span>
          </div>
        </div>
      )}
      <ul role='list' className='divide-y divide-gray-200'>
        {list.items?.map((item) => (
          <li key={item.id} className='bg-slate-50 px-3 py-2'>
            <ListItem item={item} />
          </li>
        ))}
        <CreatingLine />
      </ul>
    </div>
  )
}
