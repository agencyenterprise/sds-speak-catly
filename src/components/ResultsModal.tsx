import { CheckSpellingResponse } from '@/app/api/checkPronunciation/route'
import Button from '@/components/Button'
import classNames from 'classnames'
import React from 'react'

interface ResultsModalProps {
  result: CheckSpellingResponse
  isOpen: boolean
  onClose: () => void
  onTryAgain: () => void
}

export default function ResultsModalComponent(props: ResultsModalProps) {
  const { onClose, result, isOpen, onTryAgain } = props

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div className='min-h-1/2 z-10 w-full rounded-lg p-4 shadow-lg lg:w-3/4'>
        <div className='flex h-full w-full flex-col justify-between text-center text-xl text-gray-800'>
          <div id='result' className='rounded-lg bg-white p-2 md:p-6 md:shadow flex flex-col gap-4'>
            <h2 className=' text-2xl font-bold'>Results</h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='rounded bg-primary-100 p-4'>
                <h3 className='mb-2 text-center font-semibold'>
                  Overall Score
                </h3>
                <p className='text-center text-3xl'>{result.score}</p>
              </div>
              <div className='rounded bg-green-100 p-4'>
                <h3 className='mb-2 text-center font-semibold'>Words Score</h3>
                <div className='flex flex-wrap justify-center gap-2'>
                  {result.words.map((word, index) => (
                    <div key={index} className='mb-2'>
                      <p className='flex flex-col gap-2'>
                        <span className='font-medium'>
                          &quot;{word.label}&quot;
                        </span>
                        <span className='text-center font-medium'>
                          {word.score}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='rounded bg-yellow-100 p-4'>
                <h3 className='mb-2 text-center font-semibold'>
                  Accent Predictions
                </h3>
                <div className='flex flex-row items-center justify-center gap-2 md:gap-4'>
                  <div className='flex flex-col gap-2'>
                    <span className=''>US</span>
                    <span className='font-medium'>
                      {result.accent_predictions.en_US}%
                    </span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className=''>UK</span>
                    <span className='font-medium'>
                      {result.accent_predictions.en_UK}%
                    </span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className=''>AU</span>
                    <span className='font-medium'>
                      {result.accent_predictions.en_AU}%
                    </span>
                  </div>
                </div>
              </div>
              <div className='rounded bg-red-100 p-4'>
                <h3 className='mb-2 text-center font-semibold'>Exam Scores</h3>
                <p className=''>
                  IELTS:{' '}
                  <span className='font-medium'>
                    {result.score_estimates.ielts}
                  </span>
                </p>
                <p className=''>
                  TOEFL:{' '}
                  <span className='font-medium'>
                    {result.score_estimates.toefl}
                  </span>
                </p>
                <p className='flex flex-row justify-center gap-2'>
                  CEFR:{' '}
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((grade, index) => (
                    <span
                      className={classNames(
                        result.score_estimates.cefr === grade
                          ? 'font-bold'
                          : 'font-light text-gray-800',
                      )}
                      key={index}
                    >
                      {grade}
                    </span>
                  ))}
                </p>
                <p className=''>
                  PTE General:{' '}
                  <span className='font-medium'>
                    {result.score_estimates.pte_general}
                  </span>
                </p>
              </div>
            </div>
            <Button onClick={onTryAgain}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
