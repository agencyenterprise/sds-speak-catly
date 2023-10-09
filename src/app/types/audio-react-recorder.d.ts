
declare module 'audio-react-recorder' {
  export enum RecordState {
    START = 'START',
    STOP = 'STOP',
    NONE = 'NONE',
    PAUSE = 'PAUSE',
  }

  interface AudioReactRecorderProps {
    state: string;
    onStop: (params: any) => any;
    type?: string;
    foregroundColor?: string;
    backgroundColor?: string;
    canvasHeight?: number | string;
    canvasWidth?: number | string;
  }

  declare const AudioReactRecorder: import('React').ComponentClass<AudioReactRecorderProps>
  export default AudioReactRecorder;
}