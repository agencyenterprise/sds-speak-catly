import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { base64, text } = await req.json()

  const response = await axios.post(
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
