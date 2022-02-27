<template>
  <DragItem>
    <div class="field-item border border-gray-400 p-2 select-none">
      {{ name }}
    </div>
  </DragItem>
</template>
<script setup lang="ts">
import DragItem from '../Dnd/DragItem.vue'
defineProps({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})
</script>
<style>
</style>
