import { fill, groupBy, max, minBy, orderBy, range, sumBy } from 'lodash-es'
import type { FieldItemDTO, LayoutArea, LayoutAreaInfo, LayoutFieldItem } from '~/model'
import type { Position, Rect } from '~/stores/drag'

export const fromLayoutDTO = (fields: FieldItemDTO[], columnCount = 6): LayoutFieldItem[] => {
  const PercentageToColumnFactor = 100 / columnCount
  const yGroups = groupBy(fields, f => f.ordinate)
  return Object.entries(yGroups).flatMap(([y, fields]) =>
    fields.map(field => ({
      code: field.code,
      column: Math.round((field.start || 0) / PercentageToColumnFactor),
      row: Number(y),
      rowSpan: 1,
      columnSpan: Math.round(field.width / PercentageToColumnFactor),
    })))
}

export const canInsertToRow = (existing: Array<{ minColumnSpan: number }>, columnCount: number, requisiteSpan: number) => {
  return existing.length ? sumBy(existing, f => f.minColumnSpan) + requisiteSpan <= columnCount : true
}

export const getHelperFunction = (areaWidth: number, { columnCount, columnGap, rowGap, rowHeight }: LayoutAreaInfo) => {
  const columnWidth = (areaWidth - ((columnCount - 1) * columnGap)) / columnCount
  return {
    toPosition: (row: number, column: number) => {
      return {
        x: column * (columnWidth + columnGap),
        y: row * (rowHeight + rowGap),
      }
    },
    toWidth: (columnSpan: number) => {
      return columnSpan * (columnWidth + columnGap) - columnGap
    },
    columnWidth,
  }
}

// export const calcDistance = (a: Position, b: Position) =>
//   Math.floor(Math.sqrt(Math.pow(a.x - b.x, 2)) + Math.pow(a.y - b.y, 2))

export const getInsertedRowIndex = (
  existing: Array<{ code: string; column: number; columnSpan: number; minColumnSpan: number }>,
  dragObject: Position,
  toPosition: (row: number, column: number) => { x: number; y: number },
  toWidth: (columnSpan: number) => number,
) => {
  const distances = orderBy(existing, 'column', 'asc').map((f) => {
    const position = toPosition(0, f.column)
    const centerX = position.x + toWidth(f.columnSpan) / 2
    return { ...f, ...position, distance: dragObject.x - centerX, width: toWidth(f.columnSpan) }
  })
  // 第一个负数前面，如果都是整数就是最后一个
  const firstNegative = distances.findIndex(f => f.distance < 0)

  return firstNegative === -1 ? distances.length : firstNegative
}

const getRowLayout = (existing: LayoutFieldItem[], inserted: { code: string; column: number }, columnCount: number, row: number): LayoutFieldItem[] => {
  const columnSpan = columnCount / (existing.length + 1)
  const existingOrder = orderBy(existing, 'column', 'asc')
  return range(0, (existing.length + 1)).map((column) => {
    if (column === inserted.column) {
      return {
        code: inserted.code,
        column: column * columnSpan,
        columnSpan,
        row,
        rowSpan: 1,
      }
    }
    else {
      const field = existingOrder.shift()
      return {
        code: field!.code,
        column: column * columnSpan,
        columnSpan,
        row,
        rowSpan: 1,

      }
    }
  })
}

export const calcGhostRect
  = (
    area: Rect,
    areaLayout: LayoutArea,
    dragObject: Position,
    minColumnSpan = 2,
  ): (LayoutFieldItem & { type?: string })[] => {
    const rowCount = max(areaLayout.fields.map(f => f.row)) || 0
    const { rowHeight } = areaLayout.info
    const { toPosition, toWidth } = getHelperFunction(area.width, areaLayout.info)

    const nearestRow = minBy(fill(Array(rowCount + 1), 0) // +1 for the new row
      .map((_, i) => (
        {
          row: i, distance: dragObject.y - (i * (rowHeight + areaLayout.info.rowGap) + rowHeight / 2),
        })), f => Math.abs(f.distance))!
    let canInsertRow = false
    if (nearestRow.distance < rowHeight / 4) {
      canInsertRow = canInsertToRow(
        areaLayout.fields
          .filter(f => f.row === nearestRow.row)
          .map(() => ({ minColumnSpan: 2 })), // 如果是需要独占的话，需要是 6 areaLayout.info.columnCount
        areaLayout.info.columnCount, minColumnSpan)
    }

    if (canInsertRow) {
      const shadowColumn = getInsertedRowIndex(areaLayout.fields
        .filter(f => f.row === nearestRow.row)
        .map(f => ({ ...f, minColumnSpan: 2 })), dragObject, toPosition, toWidth)
      return [
        ...areaLayout.fields
          .filter(f => f.row !== nearestRow.row),
        ...getRowLayout(areaLayout.fields.filter(f => f.row === nearestRow.row),
          { code: 'new', column: shadowColumn },
          areaLayout.info.columnCount, nearestRow.row),
      ]
    }
    else {
      return [{
        code: 'new',
        row: nearestRow.row + 1,
        column: 0,
        columnSpan: areaLayout.info.columnCount,
        rowSpan: 1,
        type: '__new__line__',
      }, ...areaLayout.fields.map(f => ({ ...f, row: f.row <= nearestRow.row ? f.row : f.row }))]
    }
  }
