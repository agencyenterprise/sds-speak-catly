'use client'
import { SetWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { CurrentActiveSet } from '@/atoms/CurrentActiveSet'
import { SetsAtom } from '@/atoms/SetsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import { useHandleItem } from '@/hooks/useHandleItem'
import { useHandleSet } from '@/hooks/useHandleSet'
import { useRef, useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useSetRecoilState } from 'recoil'

export default function SetComponent({
  set,
  onClick
}: {
  set: SetWithItemsAndMetrics
  onClick: (setId: string) => void
}) {
  const setSets = useSetRecoilState(SetsAtom)
  const [isEditingSet, setIsEditingSet] = useState(false)
  const setCurrentActiveSet = useSetRecoilState(CurrentActiveSet)
  const editingSetRef = useRef<HTMLTextAreaElement>(null)

  const handleSet = useHandleSet()

  function handleSetClick() {
    setCurrentActiveSet(set)
  }

  async function handleEditSet() {
    if (!editingSetRef.current?.value) return

    setIsEditingSet(false)
    const updatedSet = await handleSet.handleEditSet(
      set.id,
      editingSetRef.current?.value,
    )

    setSets(updatedSet)
  }

  async function handleSetRemove(setId: string) {
    setSets((sets) => sets.filter((set) => set.id !== setId))
    await handleSet.handleRemoveSet(setId)
  }

  function handleSetEditReturn(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleEditSet()
    }
  }

  return (
    <div onClick={() => onClick(set.id)} className='relative w-full flex-grow'>
      {!isEditingSet ? (
        <div onClick={handleSetClick} className='cursor-pointer top-0 z-10 flex justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-3 '>
          <h3 className='text-md font-semibold leading-6 text-white'>
            {set.title}
          </h3>
          <ElipsisMenu
            handleEdit={() => setIsEditingSet(true)}
            handleRemove={() => handleSetRemove(set.id)}
            color='white'
          />
        </div>
      ) : (
        <div className='top-0 z-10 flex gap-4 rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-1.5 '>
          <textarea
            className='input leading-[0.95rem]'
            placeholder='Enter the set title...'
            autoFocus
            defaultValue={set.title}
            rows={1}
            ref={editingSetRef}
            onKeyDown={handleSetEditReturn}
          />
          <div className='flex flex-row items-center gap-3 rounded-lg bg-white px-2'>
            <span
              onClick={handleEditSet}
              className='cursor-pointer text-2xl text-green-500'
            >
              <FaCheck />
            </span>
            <span
              className='cursor-pointer text-xl text-red-500'
              onClick={() => setIsEditingSet(false)}
            >
              <FaX />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
