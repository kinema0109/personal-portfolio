import type { MemorySlot, MemorySlotId } from './types'

/**
 * Confirmed so far: Thọ has played many games, from Famicom/NES to modern games,
 * including gacha. No specific titles or memories have been supplied yet.
 *
 * MISSING: add entries like
 *   { title: 'Tên game', platform: 'Famicom · khoảng năm …', note: 'Một câu ngắn' }
 * Keep each note to at most two short sentences.
 */
export const memorySlots: readonly MemorySlot[] = [
  {
    id: 'early',
    label: 'Những game đầu tiên',
    confirmed: {
      speaker: 'THỌ',
      lines: ['Mình bắt đầu chơi game từ thời Famicom/NES.'],
      status: 'ready',
      source: 'Thông tin Thọ cung cấp',
    },
    entries: [],
  },
  {
    id: 'return',
    label: 'Game mình vẫn quay lại',
    confirmed: null,
    entries: [],
  },
  {
    id: 'now',
    label: 'Điều mình thích bây giờ',
    confirmed: {
      speaker: 'THỌ',
      lines: ['Bây giờ mình chơi cả game hiện đại, trong đó có game gacha.'],
      status: 'ready',
      source: 'Thông tin Thọ cung cấp',
    },
    entries: [],
  },
]

export function getMemorySlot(id: MemorySlotId): MemorySlot {
  const slot = memorySlots.find((s) => s.id === id)
  if (!slot) throw new Error(`Unknown memory slot: ${id}`)
  return slot
}
