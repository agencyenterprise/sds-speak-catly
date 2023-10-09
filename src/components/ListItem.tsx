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
          console.log(data)
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
    console.log({ itemId })
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
        {item.concludedAt ? (
          <div className='flex flex-row items-center gap-2 text-black'>
            {item.score}
            <div className='h-8 w-8 flex-none rounded-full border-2 border-success-500 bg-gray-50'>
              <CheckCircleIcon height={24} width={24} color='#40ba73' />
            </div>
          </div>
        ) : (
          <div className='flex flex-row items-center gap-2 text-2xl text-black'>
            <div className='min-w-[42px] pr-4'>{'--'}</div>
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
        )}
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
