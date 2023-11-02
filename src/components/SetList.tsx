'use client'
import { SetWithItemsAndMetrics } from '@/app/types/databaseAux.types'
import { CurrentActiveSet } from '@/atoms/CurrentActiveSet'
import { SetsAtom } from '@/atoms/SetsAtom'
import { twMerge } from "tailwind-merge";
import ElipsisMenu from '@/components/ElispsisMenu'
import { useHandleSet } from '@/hooks/useHandleSet'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useSetRecoilState } from 'recoil'
import { Tooltip } from 'react-tooltip';

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

  const [averageScore, setAverageScore] = useState('--')

  useEffect(() => {
    if (!set.items.length) return;
    const calculatedAvgScore = set.items.reduce((acc, item) => {
      const spellingMetrics = item.userPronunciationMetrics?.spellingMetrics
      const lastSpellingMetric = spellingMetrics?.[spellingMetrics.length - 1]
      if (!lastSpellingMetric) return acc

      return acc + lastSpellingMetric.score
    }, 0) / set.items.length

    setAverageScore(calculatedAvgScore.toFixed(0))

  }, [set.items])
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

  function getAverageScoreColor() {
    if (averageScore === '--') return 'text-gray-400'
    if (Number(averageScore) >= 80) return 'text-green-500'
    if (Number(averageScore) >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  function AverageScore() {
    const color = getAverageScoreColor()
    return (
      <>
        <Tooltip id={'score-tooltip' + set.id} />
        <div
          data-tooltip-id={'score-tooltip' + set.id}
          data-tooltip-content='Average score of the set'
          className={twMerge('flex items-center justify-center w-8 h-8 rounded-md bg-white text-primary-500 text-sm font-bold text-gra', color)}
        >
          {averageScore}
        </div>
      </>
    )
  }

  return (
    <div onClick={() => onClick(set.id)} className='relative w-full flex-grow'>
      {!isEditingSet ? (
        <div onClick={handleSetClick} className='items-center cursor-pointer top-0 z-10 flex justify-between rounded border-y border-b-gray-200 border-t-gray-100 bg-primary-500 px-3 py-3 '>
          <AverageScore />
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
              className='cursor-pointer text-2xl text-green-500 flex items-center'
              onClick={e => { e.stopPropagation(); handleEditSet() }}
            >
              <FaCheck />
            </span>
            <span
              className='cursor-pointer text-xl text-red-500 flex items-center'
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
