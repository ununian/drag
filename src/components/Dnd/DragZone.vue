
<template>
  <div
    :id="id"
    class="drag-zone"
    :class="{
      'drop-active': isActive,
      'drop-target': store.dropTarget?.id === id,
    }"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import interact from 'interactjs'
import { useDragStore } from '~/stores/drag'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const store = useDragStore()

const [isActive, toggleActive] = useToggle(false)

onMounted(() => {
  interact(`#${props.id}.drag-zone`)
    .dropzone({
      accept: '.drag-item',
      overlap: 'pointer', // listen for drop related events:
      ondropactivate() {
        toggleActive(true)
      },
      ondragenter(event) {
        // const draggableElement = event.relatedTarget
        // const dropzoneElement = event.target
        const rect = document.querySelector<HTMLDivElement>(`#${props.id}.drag-zone`)!.getBoundingClientRect()

        store.dropTarget = { id: props.id, x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      },
      ondragleave(event) {
        if (store.dropTarget?.id === props.id)
          store.dropTarget = undefined
      },
      ondrop(event) {
        // event.relatedTarget.textContent = 'Dropped'
      },
      ondropdeactivate(event) {
        toggleActive(false)
        if (store.dropTarget?.id === props.id)
          store.dropTarget = undefined
      },
    })
})
</script>
<style>
.drag-zone {
  border: dashed 4px transparent;
}
.drag-zone.drop-active {
  border-color: #aaa;
}
.drag-zone.drop-target {
  background-color: #bfe4ff;
}
</style>
