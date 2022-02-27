import { describe, expect, it } from 'vitest'
import { calcGhostRect, fromLayoutDTO } from '../src/service/layout'
import { leftFields } from '~/model'

describe('layout', () => {
  it('should works', () => {
    const b = fromLayoutDTO(leftFields)
    console.log(b)
    const g = calcGhostRect({ x: 0, y: 0, width: 100, height: 100 }, {
      name: 'left',
      info: {
        columnCount: 6,
        columnGap: 2,
        rowHeight: 4,
        rowGap: 2,
      },
      fields: [],
    }, { x: 20, y: 10, width: 15, height: 4 })
    expect(g).toEqual(2)
  })
})
