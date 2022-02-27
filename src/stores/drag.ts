import { acceptHMRUpdate, defineStore } from 'pinia'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type Rect = Position & Size

const useDragObject = () => {
  const objectPosition = ref<Rect>()
  const objectId = ref<string>()

  const makeDragStart = (position: Rect, id: string) => {
    if (!objectId.value) {
      objectPosition.value = position
      objectId.value = id
    }
  }

  const makeDragEnd = () => {
    objectPosition.value = undefined
    objectId.value = undefined
  }

  const moveObject = (dx: number, dy: number) => {
    if (objectPosition.value) {
      objectPosition.value = {
        x: objectPosition.value.x + dx,
        y: objectPosition.value.y + dy,
        width: objectPosition.value.width,
        height: objectPosition.value.height,
      }
    }
  }

  return {
    objectPosition,
    objectId,
    makeDragStart,
    moveObject,
    makeDragEnd,
  }
}

const useDragZone = () => {
  const dropTarget = ref<{
    id: string
  } & Position>()

  return { dropTarget }
}

export const useDragStore = defineStore('drag', () => {
  return { ...useDragObject(), ...useDragZone() }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDragStore, import.meta.hot))
