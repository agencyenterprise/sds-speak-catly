import { RecordState } from "audio-react-recorder";
import classNames from "classnames";

interface RecordButtonProps {
  recordState: RecordState
  setRecordState: (state: RecordState) => void
  loadingResult: boolean
  text: string
}

export default function RecordButton(props: RecordButtonProps) {

  const { recordState, setRecordState, loadingResult, text } = props
  return (
    <>
      <button
        disabled={loadingResult || !text.length}
        onClick={() =>
          recordState != RecordState.START
            ? setRecordState(RecordState.START)
            : setRecordState(RecordState.STOP)
        }
        className={classNames(
          'flex w-10 h-10 text-sm flex-row items-center justify-center gap-2 rounded py-2 text-white disabled:bg-neutral-400',
          recordState !== RecordState.START
            ? 'bg-green-500'
            : 'animate-pulse bg-red-500',
        )}
      >
        {recordState === RecordState.START ? (
          <>End</>
        ) : (
          <>Try</>
        )}
      </button>
      <button
        onClick={() => setRecordState(RecordState.STOP)}
        className={classNames(
          'rounded h-10 text-sm bg-neutral-500 p-2 text-white',
          recordState !== RecordState.START && 'hidden',
        )}
      >
        Abort
      </button>
    </>
  )
}