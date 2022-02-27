import { range } from 'lodash-es'

export const Components: FieldComponent[] = range(1, 20).map(i => ({
  code: `field-${i}`, name: `字段${i}`,
}))

export const leftFields: FieldItemDTO[] = [
  { code: 'field-1', start: 0, width: 50, ordinate: 0 },
  { code: 'field-2', start: 50, width: 50, ordinate: 0 },
  { code: 'field-3', start: 33, width: 33, ordinate: 1 },
  { code: 'field-4', start: 0, width: 33, ordinate: 1 },
  { code: 'field-5', start: 0, width: 50, ordinate: 2 },
  { code: 'field-6', start: 0, width: 100, ordinate: 3 },
  { code: 'field-7', start: 33, width: 33, ordinate: 4 },
]

export const rightFields: FieldItemDTO[] = [
  { code: 'field-8', start: 0, width: 100, ordinate: 1 },
  { code: 'field-9', start: 0, width: 100, ordinate: 2 },
  { code: 'field-10', start: 0, width: 100, ordinate: 3 },
]

export interface FieldItemDTO {
  code: string
  start: number
  width: number
  ordinate: number
}

export interface FieldComponent {
  code: string
  name: string
}

export interface LayoutInfo {
  leftArea: LayoutArea
  rightArea: LayoutArea
}

export interface LayoutArea {
  name: 'left' | 'right'
  info: LayoutAreaInfo
  fields: LayoutFieldItem[]
}

export interface LayoutFieldItem {
  code: string
  column: number
  row: number
  rowSpan: number
  columnSpan: number
}

export interface LayoutAreaInfo {
  columnCount: number
  rowHeight: number
  columnGap: number
  rowGap: number
}
