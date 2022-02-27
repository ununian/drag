<template>
  <div p-2>
    <FieldComponent
      v-for="field in Components"
      :key="field.code"
      m-t-4
      :name="field.name"
      :code="field.code"
    />
  </div>
</template>
<script setup lang="ts">
import FieldComponent from './FieldComponent.vue'
import { Components } from '~/model'
</script>
