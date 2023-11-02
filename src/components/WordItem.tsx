import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import { ItemsWithMetrics } from '@/app/types/databaseAux.types'
import { CurrentActiveSet } from '@/atoms/CurrentActiveSet'
import { SetsAtom } from '@/atoms/SetsAtom'
import Card from '@/components/Card'
import ElipsisMenu from '@/components/ElispsisMenu'
import RecordButton from '@/components/RecordButton'
import { useHandleItem } from '@/hooks/useHandleItem'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
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
  const [recordedFirstTime, setRecordedFirstTime] = useState(false)

  const setSets = useSetRecoilState(SetsAtom)
  const setCurrentActiveSet = useSetRecoilState(CurrentActiveSet)
  const { data: session } = useSession()
  const handleItem = useHandleItem()
  const modal = useResultModal()

  const spellingMetrics = item.userPronunciationMetrics?.spellingMetrics
  const lastSpellingMetric = spellingMetrics?.[spellingMetrics.length - 1]


  useEffect(() => {
    const localRecordedFirstTime = localStorage.getItem('recordedFirstTime')

    if (localRecordedFirstTime) {
      setRecordedFirstTime(true)
    }
  }, [])

  function handleRecordedFirstTime() {
    if (!recordedFirstTime) {
      localStorage.setItem('recordedFirstTime', 'true')
      setRecordedFirstTime(true)
    }
  }

  async function handleCheckSpelling(text: string, base64: string) {
    const { data } = await axios
      .post<AxiosResponse<CheckSpellingResponse>>('/api/checkPronunciation', {
        base64,
        text,
      }).catch((err) => {
        console.error(err)
        return err
      })

    await updateSpellingMetrics(data.data)
    modal.openModal({})
  }

  async function onStopRecording(param: { blob: Blob }) {
    setRecordingAgain(false)
    handleRecordedFirstTime()
    if (param.blob.size === 0) return

    setLoadingResult(true)
    const reader = new FileReader()
    reader.readAsDataURL(param.blob)
    reader.onloadend = async function () {
      const base64data = reader.result as string
      const base64WithoutPrefix = base64data.split(',')[1]

      await handleCheckSpelling(item.text, base64WithoutPrefix)
      setLoadingResult(false)
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

    const updatedActiveSet = updatedSet.find((set) => set.id === item.setId)
    setSets(updatedSet)

    if (!updatedActiveSet) return;
    setCurrentActiveSet(updatedActiveSet)
  }

  function handleSetItemClick() {
    modal.openModal({
      onTryAgain: () => {
        setRecordingAgain(true)
      }
    })
  }

  async function handleItemRemove(setId: string, itemId: string) {
    setCurrentActiveSet((prev) => {
      if (!prev) return prev
      const updatedItems = prev.items.filter((item) => item.id !== itemId)
      return { ...prev, items: updatedItems }
    })
    await handleItem.handleItemRemove(setId, itemId)
  }

  function ResultModal() {
    return modal.ModalComponent(lastSpellingMetric)
  }

  function handleRecordAgain() {
    setRecordingAgain(true);
  }


  function Result() {
    return (
      <>
        {lastSpellingMetric?.score && (
          <>
            <div
              data-tooltip-id={'score-tooltip' + item.id}
              data-tooltip-content='This is you score, to try again click on the three dots or press the button below the results'
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
    <div className='md:w-[48%] w-full'>
      <ResultModal />
      <Tooltip className='z-50' id={'score-tooltip' + item.id} />
      <Tooltip className='z-50' id={"record-explanation" + item.id} />
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
            <div className='flex flex-row gap-3 relative'>
              {lastSpellingMetric && !recordingAgain ? (
                <Result />
              ) : (
                <>
                  <RecordButton
                    loadingResult={loadingResult}
                    recordState={recordState}
                    setRecordState={(state) => setRecordState(state)}
                    onAbort={() => setRecordingAgain(false)}
                  />
                  <div
                    data-tooltip-id={"record-explanation" + item.id}
                    data-tooltip-content="Click on 'Record Now', say the phrase above outloud and then press the 'End' button to record it"
                    className="absolute top-[-2rem] right-2 flex items-center">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-primary-400" aria-hidden="true" />
                  </div>
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
              handleRecordAgain={lastSpellingMetric ? () => handleRecordAgain() : undefined}
            />
          </span>
        </div>
      </Card >

    </div>
  )
}
