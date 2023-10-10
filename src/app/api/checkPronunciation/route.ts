import axios, { AxiosResponse } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export interface CheckSpellingResponse {
  words: Array<{
    label: string
    syllables: Array<{
      label: string
      label_ipa: string
      score: number
      phones: Array<{
        label: string
        label_ipa: string
        confidence: number
        score: number
        error: boolean
        sounds_like: Array<{
          label: string
          label_ipa: string
          confidence: number
        }>
      }>
    }>
    phones: Array<{
      label: string
      label_ipa: string
      confidence: number
      score: number
      error: boolean
      sounds_like: Array<{
        label: string
        label_ipa: string
        confidence: number
      }>
    }>
    score: number
  }>
  score: number
  accent_predictions: {
    en_US: number
    en_UK: number
    en_AU: number
  }
  score_estimates: {
    ielts: string
    toefl: string
    cefr: string
    pte_general: string
  }
}

export async function POST(req: NextRequest) {
  const { base64, text } = await req.json()

  const response = await axios.post<AxiosResponse<CheckSpellingResponse>>(
    'https://pronunciation-assessment1.p.rapidapi.com/pronunciation',
    {
      audio_format: 'wav',
      text: text,
      audio_base64: base64,
    },
    {
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.PRONUNCIATION_ASSESSMENT_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'pronunciation-assessment1.p.rapidapi.com',
      },
    },
  )

  return NextResponse.json({ status: 200, data: response.data })
}
