import { createContext, useContext } from 'react'

export interface ChapterCtxValue {
  done: (key: string) => boolean
  markDone: (key: string) => void
}

export const ChapterCtx = createContext<ChapterCtxValue>({
  done: () => false,
  markDone: () => {},
})

export const useChapter = () => useContext(ChapterCtx)
