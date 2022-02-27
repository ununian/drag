
<template>
  <div
    v-if="store.objectId && store.objectPosition"
    class="absolute top-0 left-0 bg-red-400 opacity-20"
    :style="{
      width: store.objectPosition.width + 'px',
      height: store.objectPosition.height+ 'px',
      transform: `translate(${store.objectPosition.x}px, ${store.objectPosition.y}px)`,
    }"
  />
</template>
<script setup lang="ts">import { useDragStore } from '~/stores/drag'

const store = useDragStore()
</script>
<style>
</style>
