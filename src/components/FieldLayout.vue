
<template>
  <DragZone :id="area" h-full class="relative">
    <!-- <div
      v-if="ghostRect.nearest"
      class="shadow absolute left-0 top-0 bg-red-400"
      :style="{
        height: '40px',
        width: `${ghostRect.nearest.width}px`,
        transform: `translate(${ghostRect.nearest.x}px,${ghostRect.nearest.y}px)`,
      }"
    />-->

    <div
      ref="grid"
      grid
      :style="{
        'grid-column-gap': `${ColumnGap}px`,
        'grid-row-gap': `${RowGap}px`,
        'grid-template-columns': `repeat(${ColumnNumber}, 1fr)`,
        'grid-auto-rows': 'auto'
      }"
    >
      <div
        v-for="(item, i) in newLayoutItems"
        :key="i"
        class="bg-blue-300"
        :style="{
          gridArea: `${item.row + 1} / ${item.column + 1} / ${item.rowSpan} span / ${item.columnSpan} span`,
          backgroundColor: item.code === 'new' ? 'red' : '',
          height: item.type === '__new__line__' ? '1px' : '40px',
          transform: item.type === '__new__line__' ? 'translateY(-10px)' : '',
        }"
      >
        {{ item.code }}
      </div>
    </div>
  </DragZone>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { FieldItemDTO, LayoutFieldItem } from '~/model'
import { calcGhostRect, fromLayoutDTO } from '~/service/layout'
import { useDragStore } from '~/stores/drag'

const RowGap = 20
const ColumnGap = 20
const ColumnNumber = 6
const gridEl = templateRef('grid')
const { width, height, x, y } = useElementBounding(gridEl)
const { x: mouseX, y: mouseY } = useMouseInElement(gridEl)

const props = defineProps({
  area: {
    type: String as PropType<'left' | 'right'>,
    required: true,
  },
  fields: {
    type: Array as PropType<FieldItemDTO[]>,
    default: () => [],
  },
  minColumnSpan: {
    type: Number,
    default: 2,
  },
})

const store = useDragStore()

const fieldLayoutItem = computed(() => fromLayoutDTO(props.fields, ColumnNumber))
const newLayoutItems = computed(() => {
  if (store.dropTarget?.id === props.area) {
    return calcGhostRect({
      x: x.value,
      y: y.value,
      width: width.value,
      height: height.value,
    }, {
      name: props.area,
      fields: fieldLayoutItem.value,
      info: {
        columnCount: ColumnNumber,
        columnGap: ColumnGap,
        rowHeight: 40,
        rowGap: RowGap,
      },
    }, {
      x: mouseX.value - x.value, y: mouseY.value - y.value,
    }, props.minColumnSpan)
  }
  return fieldLayoutItem.value as (LayoutFieldItem & { type?: string })[]
})

// const targetFieldItem = computed(() =>
//   fieldLayoutItem.value.find(item => ghostRect.value.min.row === item.row && ghostRect.value.min.column - item.column < item.columnSpan && ghostRect.value.min.column - item.column >= 0),
// )

// const targetFieldGridItem = computed(() => targetFieldItem.value ? ghostRect.value.grid[targetFieldItem.value.row][targetFieldItem.value.column] : undefined)
</script>
<style>
</style>
