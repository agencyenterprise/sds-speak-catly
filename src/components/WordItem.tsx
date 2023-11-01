import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { SetsAtom } from '@/atoms/SetsAtom'
import Card from '@/components/Card'
import ElipsisMenu from '@/components/ElispsisMenu'
import RecordButton from '@/components/RecordButton'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useHandleItem } from '@/hooks/useHandleItem'
import { useResultModal } from '@/hooks/useModal'
import { SpellingMetrics } from '@prisma/client'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios, { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { useSetRecoilState } from 'recoil'

interface SetItemProps {
  item: ItemsWithMetrics
}

export default function WordItemComponent({ item }: SetItemProps) {
  const [recordState, setRecordState] = useState<RecordState>(RecordState.STOP)
  const [loadingResult, setLoadingResult] = useState(false)
  const [recordingAgain, setRecordingAgain] = useState(false)

  const setSets = useSetRecoilState(SetsAtom)
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

    await updateSpellingMetrics(data.data)
    modal.openModal({})
  }

  useEffect(() => {
    console.log(recordState);

  }, [recordState])

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

    const updatedSet = await handleItem
      .updateSpellingMetrics({
        setId: item.setId,
        itemId: item.id,
        userId,
        spellingMetrics,
      })
      .finally(() => {
        setLoadingResult(false)
      })

    setSets(updatedSet)
  }

  function handleSetItemClick() {
    modal.openModal({})
  }

  async function handleItemRemove(setId: string, itemId: string) {
    await handleItem.handleItemRemove(setId, itemId)
  }

  function ResultModal() {
    return modal.ModalComponent(lastSpellingMetric)
  }

  function handleRecordAgain() {
    setRecordingAgain(true);
    setRecordState(RecordState.START)
  }


  function Results() {
    return (
      <>
        {lastSpellingMetric?.score && (
          <>
            <Tooltip id='score-tooltip' />
            <div
              data-tooltip-id='score-tooltip'
              data-tooltip-content='This is you score, to try again click on the three dots'

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
          </>
        )}
      </>
    )
  }

  return (
    <>
      <ResultModal />
      <Card>
        <div
          className='flex w-full gap-6 cursor-pointer flex-col items-center justify-between gap-x-4 relative'
          onClick={handleSetItemClick}
        >
          <div className='flex flex-row items-center gap-4'>
            <div
              className={classNames(
                'align-middle',
                recordState !== RecordState.START && 'line-clamp-2 ',
              )}
            >
              <p className='text-md leading-5 text-gray-900'>{item.text}</p>
            </div>
          </div>


          <div className='flex flex-col items-center gap-2 text-2xl text-black'>
            <div className='flex  flex-row gap-3'>
              {lastSpellingMetric && !recordingAgain ? (
                <Results />
              ) : (
                <>
                  <RecordButton
                    loadingResult={loadingResult}
                    recordState={recordState}
                    setRecordState={(state) => setRecordState(state)}
                  />
                  <AudioReactRecorder
                    state={recordState}
                    onStop={onStopRecording}
                  />
                </>
              )}
            </div>
          </div>

          <span className='absolute top-0 right-0'>
            <ElipsisMenu
              handleRemove={() => handleItemRemove(item.setId, item.id)}
              handleRecordAgain={lastSpellingMetric?.score ? () => handleRecordAgain() : undefined}
            />
          </span>
        </div>
      </Card >

    </>
  )
}
