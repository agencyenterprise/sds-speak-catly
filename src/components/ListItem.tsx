import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import RecordButton from '@/components/RecordButton'
import { useResultModal } from '@/hooks/useModal'
import { Item, SpellingMetrics, UserPronunciationMetrics } from '@prisma/client'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios, { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useSetRecoilState } from 'recoil'

interface ListItemProps {
  item: ItemsWithMetrics
}

export default function ListItemComponent({ item }: ListItemProps) {
  const [recordState, setRecordState] = useState<RecordState>(RecordState.STOP)
  const [loadingResult, setLoadingResult] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const setLists = useSetRecoilState(ListsAtom)
  const modal = useResultModal()
  const { data: session } = useSession()

  const spellingMetrics = item.userPronunciationMetrics?.spellingMetrics
  const lastSpellingMetric = spellingMetrics?.[spellingMetrics.length - 1]

  async function handleCheckSpelling(text: string, base64: string) {
    const { data } = await axios
      .post<AxiosResponse<CheckSpellingResponse>>('/api/checkPronunciation', {
        base64,
        text,
      })
      .finally(() => {
        setLoadingResult(false)
      })

    updateSpellingMetrics(data.data)
    modal.openModal({})
  }

  async function onStopRecording(param: any) {
    setLoadingResult(true)
    const reader = new FileReader()
    reader.readAsDataURL(param.blob)
    reader.onloadend = async function () {
      const base64data = reader.result as string
      const base64WithoutPrefix = base64data.split(',')[1]

      await handleCheckSpelling(item.text, base64WithoutPrefix)
    }
  }

  async function updateSpellingMetrics(spellingMetrics: SpellingMetrics) {
    const userId = session?.user?.id

    const { data } = await axios
      .post<AxiosResponse<ItemsWithMetrics>>('/api/spellingMetrics', {
        spellingMetrics,
        userId,
        itemId: item.id,
      })
      .finally(() => {
        setLoadingResult(false)
      })

    setLists((oldLists) => {
      const newList = oldLists.map((list) => {
        if (list.id === item.listId) {
          return {
            ...list,
            items: [
              ...list.items.map((prevItem) => {
                if (prevItem.id === item.id) {
                  return data.data
                }
                return prevItem
              }),
            ],
          }
        }
        return list
      })
      return newList
    })
  }

  function handleListItemClick() {
    modal.openModal({})
  }

  async function handleItemEdit() {
    if (!textAreaRef.current?.value) return

    const newText = textAreaRef.current.value
    const listId = item.listId

    const { data } = await axios.patch<AxiosResponse<Item>>(
      `/api/item/${item.id}`,
      {
        text: newText,
      },
    )

    const newItem = data.data

    setIsEditing(false)
    setLists((oldLists) => {
      return oldLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items.map((oldItem) => {
                if (oldItem.id === item.id) {
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
    })
  }

  async function handleItemRemove(listId: string, itemId: string) {
    setLists((oldLists) => {
      return oldLists.map((list) => {
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
    })

    await axios.delete<AxiosResponse<Item>>(`/api/item/${itemId}`)
  }

  function handleReturn(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleItemEdit()
    }
  }

  function ContentRender() {
    if (isEditing) {
      return (
        <div className='flex flex-row items-center justify-end gap-x-5 rounded bg-slate-50 px-3 py-1'>
          <textarea
            className='input w-1/2 leading-[0.95rem]'
            placeholder='Enter the text...'
            autoFocus
            rows={1}
            defaultValue={item.text}
            ref={textAreaRef}
            onKeyDown={handleReturn}
          />
          <div className='flex flex-row items-center gap-2'>
            <span
              onClick={handleItemEdit}
              className='cursor-pointer text-2xl text-green-500'
            >
              <FaCheck />
            </span>
            <span
              className='cursor-pointer text-xl text-red-500'
              onClick={() => setIsEditing(false)}
            >
              <FaX />
            </span>
          </div>
        </div>
      )
    }
    return (
      <div
        className='flex w-full cursor-pointer flex-row items-center justify-between gap-x-4'
        onClick={handleListItemClick}
      >
        <div className='flex flex-row items-center gap-4'>
          <div className='flex flex-row items-center gap-2 text-2xl text-black'>
            <div className='min-w-[65px] pr-4'>
              {lastSpellingMetric?.score ? (
                <div
                  className={classNames(
                    'flex flex-row items-center gap-2 font-bold text-black',
                    lastSpellingMetric.score >= 80
                      ? 'text-green-500'
                      : lastSpellingMetric.score >= 50
                      ? 'text-yellow-400'
                      : 'text-red-500',
                  )}
                >
                  {lastSpellingMetric.score}
                </div>
              ) : (
                <>{'--'}</>
              )}
            </div>
            <div className='flex min-w-[7rem] flex-row gap-3'>
              <RecordButton
                text={item.text}
                loadingResult={loadingResult}
                recordState={recordState}
                setRecordState={(state) => setRecordState(state)}
              />
              <AudioReactRecorder
                state={recordState}
                onStop={onStopRecording}
              />
            </div>
          </div>
          <div
            className={classNames(
              'align-middle',
              recordState !== RecordState.START && 'line-clamp-2 ',
            )}
          >
            <p className='text-sm leading-5 text-gray-900'>{item.text}</p>
          </div>
        </div>
        <ElipsisMenu
          handleEdit={() => setIsEditing(true)}
          handleRemove={() => handleItemRemove(item.listId, item.id)}
        />
      </div>
    )
  }

  return (
    <>
      {modal.ModalComponent(lastSpellingMetric)}
      <ContentRender />
    </>
  )
}
