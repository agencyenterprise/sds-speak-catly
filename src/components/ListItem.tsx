import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import RecordButton from '@/components/RecordButton'
import { useResultModal } from '@/hooks/useModal'
import { CheckCircleIcon, MicrophoneIcon } from '@heroicons/react/20/solid'
import { Item } from '@prisma/client'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios, { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

interface ListItemProps {
  item: Item
}

export default function ListItemComponent({ item }: ListItemProps) {
  const [recordState, setRecordState] = useState<RecordState>(RecordState.STOP)
  const [result, setResult] = useState<CheckSpellingResponse>()
  const [loadingResult, setLoadingResult] = useState(false)

  const modal = useResultModal()

  const setLists = useSetRecoilState(ListsAtom)

  useEffect(() => {
    if (recordState === RecordState.START) {
      setResult(undefined)
    }
  }, [recordState])

  async function onStopRecording(param: any) {
    setLoadingResult(true)
    const reader = new FileReader()
    reader.readAsDataURL(param.blob)
    reader.onloadend = function () {
      const base64data = reader.result as string
      const base64WithoutPrefix = base64data.split(',')[1]

      axios
        .post<AxiosResponse<CheckSpellingResponse>>('/api/checkPronunciation', {
          base64: base64WithoutPrefix,
          text: item.text,
        })
        .then(function ({ data }) {
          updateScore(data.data.score)
          setResult(data.data)
          setLoadingResult(false)
          modal.openModal({})
        })
        .catch(function (error) {
          console.log(error)
          setLoadingResult(false)
        })
    }
  }

  async function updateScore(score: number) {
    const { data } = await axios.post<AxiosResponse<Item>>(
      `/api/item/${item.id}/score`,
      {
        score,
      },
    )

    setLists((oldLists) => {
      return oldLists.map((list) => {
        if (list.id === item.listId) {
          return {
            ...list,
            items: [
              ...list.items.map((prevItem) => {
                console.log(data.data, item, prevItem)
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
    })
  }

  async function handleItemEdit(listId: string, itemId: string) {
    const newText = prompt('Enter the new text')
    if (!newText) return

    const { data } = await axios.patch<AxiosResponse<Item>>(
      `/api/item/${itemId}`,
      {
        text: newText,
      },
    )

    const newItem = data.data

    setLists((oldLists) => {
      return oldLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items.map((item) => {
                if (item.id === itemId) {
                  return newItem
                }
                return item
              }),
            ],
          }
        }
        return list
      })
    })
  }

  async function handleItemRemove(listId: string, itemId: string) {
    await axios.delete<AxiosResponse<Item>>(`/api/item/${itemId}`)

    setLists((oldLists) => {
      return oldLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items.filter((item) => {
                return item.id === itemId
              }),
            ],
          }
        }
        return list
      })
    })
  }

  return (
    <>
      {modal.ModalComponent(result)}
      <div className='flex flex-row items-center gap-4'>
        <div className='flex flex-row items-center gap-2 text-2xl text-black'>
          <div className='min-w-[42px] pr-4'>
            {item.concludedAt && item.score ? (
              <div
                className={classNames(
                  'flex flex-row items-center gap-2 font-bold text-black',
                  item.score >= 80
                    ? 'text-green-500'
                    : item.score >= 50
                    ? 'text-yellow-400'
                    : 'text-red-500',
                )}
              >
                {item.score}
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
            <AudioReactRecorder state={recordState} onStop={onStopRecording} />
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
        handleEdit={() => handleItemEdit(item.listId, item.id)}
        handleRemove={() => handleItemRemove(item.listId, item.id)}
      />
    </>
  )
}
