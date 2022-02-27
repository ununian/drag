
<template>
  <div :id="id" class="drag-item">
    <slot />
  </div>
</template>
<script setup lang="ts">
import interact from 'interactjs'

import { useDragStore } from '~/stores/drag'
const uid = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    + Math.random().toString(16).slice(2)
    + Date.now().toString(16).slice(4)
}
const id = `_${uid()}`
const store = useDragStore()
onMounted(() => {
  interact(`#${id}`).draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: '#root',
        endOnly: false,
      }),
    ],
    listeners: {
      start: () => {
        if (!store.objectId) {
          const el = document.querySelector<HTMLDivElement>(`#${id}`)
          if (el) {
            const rect = el.getBoundingClientRect()
            store.makeDragStart({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            }, id)
          }
        }
      },
      move: (event) => {
        if (store.objectId === id)
          store.moveObject(event.dx, event.dy)
      },
      end() {
        if (store.objectId === id)
          store.makeDragEnd()
      },
    },
  })
})

</script>
<style>
</style>
