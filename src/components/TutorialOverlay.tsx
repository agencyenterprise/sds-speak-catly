import React from 'react'

interface Props {
  xCoordinate: number
  yCoordinate: number
  radiusSize: number
  text: string
}

export default function TutorialOverlay(props: Props) {
  const { radiusSize, text, xCoordinate, yCoordinate } = props

  const textPosition = {
    x: xCoordinate + radiusSize,
    y: yCoordinate - radiusSize,
  }

  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
      <defs>
        <mask id="mask" x="0" y="0" width="100%" height="100%">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx={xCoordinate} cy={yCoordinate} r={radiusSize} fill="black" />
        </mask>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#mask)" />
      <text x={textPosition.x} y={textPosition.y} fill="white" textAnchor="middle" dy=".3em">{text}</text>
    </svg>
  )

}