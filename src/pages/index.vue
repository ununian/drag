
<template>
  <div id="root" class="bg-gray-300" w-screen h-screen>
    <div class="left">
      <FieldLayout area="left" :fields="leftFields" />
    </div>
    <div class="right">
      <FieldLayout area="right" :fields="rightFields" :min-column-span="6" />
    </div>
    <div class="fields overflow-y-auto">
      <FieldList />
    </div>
    <div class />
    <DragObject />
  </div>
</template>
<script setup lang="ts">
import FieldList from '~/components/FieldList/index.vue'
import FieldLayout from '~/components/FieldLayout.vue'
import { leftFields, rightFields } from '~/model'

</script>
<style>
#root {
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr 300px;
  grid-template-rows: 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 0px;
}

#root > div {
  border: 1px solid #999;
}
</style>
