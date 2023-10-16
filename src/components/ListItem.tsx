import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { ListsAtom } from '@/atoms/ListsAtom'
import ElipsisMenu from '@/components/ElispsisMenu'
import RecordButton from '@/components/RecordButton'
import { useHandleItem } from '@/hooks/useHandleItem'
import { useResultModal } from '@/hooks/useModal'
import { SpellingMetrics } from '@prisma/client'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios, { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'

interface ListItemProps {
  item: ItemsWithMetrics
}

export default function ListItemComponent({ item }: ListItemProps) {
  const [recordState, setRecordState] = useState<RecordState>(RecordState.STOP)
  const [loadingResult, setLoadingResult] = useState(false)

  const setLists = useSetRecoilState(ListsAtom)
  const { data: session } = useSession()
  const handleItem = useHandleItem()
  const modal = useResultModal()

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

  async function onStopRecording(param: { blob: Blob }) {
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

    if (!userId) return

    const updatedList = await handleItem
      .updateSpellingMetrics({
        listId: item.listId,
        itemId: item.id,
        userId,
        spellingMetrics,
      })
      .finally(() => {
        setLoadingResult(false)
      })

    setLists(updatedList)
  }

  function handleListItemClick() {
    modal.openModal({})
  }

  async function handleItemRemove(listId: string, itemId: string) {
    await handleItem.handleItemRemove(listId, itemId)
  }

  return (
    <>
      {modal.ModalComponent(lastSpellingMetric)}
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
          handleRemove={() => handleItemRemove(item.listId, item.id)}
        />
      </div>
    </>
  )
}
