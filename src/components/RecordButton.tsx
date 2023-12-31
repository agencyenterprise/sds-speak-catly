import { RecordState } from "audio-react-recorder"
import classNames from "classnames"

interface RecordButtonProps {
  recordState: RecordState
  setRecordState: (state: RecordState) => void
  loadingResult: boolean
  onAbort?: () => void
}

export default function RecordButton(props: RecordButtonProps) {
  const { recordState, setRecordState, loadingResult, onAbort } = props

  return (
    <>
      <button
        disabled={loadingResult}
        onClick={(e) => {
          e.stopPropagation()
          recordState != RecordState.START
            ? setRecordState(RecordState.START)
            : setRecordState(RecordState.STOP)
        }}
        className={classNames(
          'flex px-4 flex-row items-center justify-center gap-2 rounded py-2 text-sm text-white disabled:bg-neutral-400',
          recordState !== RecordState.START
            ? 'bg-green-500'
            : 'animate-pulse bg-red-500',
        )}
      >
        {recordState === RecordState.START ? <>End</> : <>Record Now</>}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setRecordState(RecordState.NONE)
          onAbort?.()
        }}
        className={classNames(
          'h-10 rounded bg-neutral-500 p-2 text-sm text-white',
          recordState !== RecordState.START && 'hidden',
        )}
      >
        Abort
      </button>
    </>
  )
}