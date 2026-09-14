import { archivedProjects, featuredProjects } from './projects'
import { memorySlots } from './memories'
import type { Choice, NodeId, StoryNode } from './types'

/**
 * Conversation graph.
 * - Each step holds at most two short sentences.
 * - status 'draft' = proposed first-person reasoning that Thọ has not confirmed.
 *   The CV says what he worked on, not how he thought about it.
 * - Back, Home and "Dự án" are always available, so they are not listed as choices.
 */

const projectChoices: Choice[] = featuredProjects.map((p) => ({
  label: p.name,
  hint: p.role,
  target: { kind: 'project', id: p.id },
}))

const memoryChoices: Choice[] = memorySlots.map((slot) => ({
  label: slot.label,
  hint: slot.entries.length === 0 ? 'Chờ nội dung' : `${slot.entries.length} ký ức`,
  target: { kind: 'memory', id: slot.id },
}))

export const posterChoice: Choice = {
  label: 'Tấm poster trên tường',
  hint: 'Cảnh phụ, có thể bỏ qua',
  target: { kind: 'node', id: 'rat' },
}

const nodes: readonly StoryNode[] = [
  {
    id: 'intro',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Mình chơi game từ thời Famicom.', 'Còn đi làm, mình làm cả giao diện lẫn hệ thống phía sau.'],
        status: 'ready',
      },
    ],
    choices: [
      { label: 'Bạn đã làm gì?', target: { kind: 'node', id: 'work' } },
      { label: 'Bạn làm việc thế nào?', target: { kind: 'node', id: 'how' } },
      { label: 'Ngoài giờ làm thì sao?', target: { kind: 'node', id: 'outside' } },
    ],
  },

  // ── Branch 1: work ────────────────────────────────────────────
  {
    id: 'work',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Mình là Middle Fullstack Developer, hiện làm ở HDWEBSOFT từ tháng 3/2025.', 'Trước đó mình làm ở Suzu Group và InmobiVN.'],
        status: 'ready',
        source: 'CV',
      },
      {
        speaker: 'THỌ',
        lines: ['Đây là ba dự án mình muốn kể trước.', 'Các dự án còn lại nằm trong kho.'],
        status: 'ready',
      },
    ],
    choices: [
      ...projectChoices,
      { label: 'Kho dự án', hint: `${archivedProjects.length} dự án khác`, target: { kind: 'archive' } },
    ],
  },

  // ── Branch 2: how I work ──────────────────────────────────────
  {
    id: 'how',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Mình kể qua vài việc cụ thể có trong CV.', 'Bạn muốn nghe về việc nào?'],
        status: 'ready',
      },
    ],
    choices: [
      { label: 'Migration MongoDB trên production', hint: 'CBPO', target: { kind: 'node', id: 'how-migration' } },
      { label: 'Webhook và tích hợp sự kiện', hint: 'TheAvoTree', target: { kind: 'node', id: 'how-events' } },
      { label: 'Phân quyền theo vai trò', hint: 'CA2T', target: { kind: 'node', id: 'how-roles' } },
    ],
  },
  {
    id: 'how-migration',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Ở CBPO, một phần việc của mình là migration MongoDB trên production.', 'Dự án có kiến trúc cơ sở dữ liệu hybrid, dùng cả PostgreSQL và MongoDB.'],
        status: 'ready',
        source: 'CV · CBPO',
      },
      {
        speaker: 'THỌ',
        lines: ['Với dữ liệu đang chạy thật, mình muốn có cách kiểm tra kết quả trước khi chuyển hẳn.', 'Mình cũng muốn biết cách quay lại nếu có vấn đề.'],
        status: 'draft',
      },
    ],
    choices: [
      { label: 'Xem chi tiết CBPO', target: { kind: 'project', id: 'cbpo' } },
      { label: 'Hỏi về việc khác', target: { kind: 'node', id: 'how' } },
    ],
  },
  {
    id: 'how-events',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Ở TheAvoTree, mình làm backend cho hệ sinh thái kết nối với WooCommerce.', 'Việc của mình gồm mô hình hoá dữ liệu, tích hợp sự kiện qua webhook, báo cáo và test.'],
        status: 'ready',
        source: 'CV · TheAvoTree',
      },
      {
        speaker: 'THỌ',
        lines: ['Một sự kiện từ hệ thống khác có thể đến nhiều lần.', 'Nên mình muốn xử lý sao cho nhận lại vẫn không làm sai dữ liệu.'],
        status: 'draft',
      },
    ],
    choices: [
      { label: 'Xem chi tiết TheAvoTree', target: { kind: 'project', id: 'theavotree' } },
      { label: 'Hỏi về việc khác', target: { kind: 'node', id: 'how' } },
    ],
  },
  {
    id: 'how-roles',
    scene: 'apartment',
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Ở CA2T, mình là Team Lead kiêm Fullstack Developer, dẫn dắt nhóm năm người.', 'Mình làm phân quyền theo vai trò cho quản trị viên và học viên.'],
        status: 'ready',
        source: 'CV · CA2T',
      },
      {
        speaker: 'THỌ',
        lines: ['Mình muốn quyền được kiểm tra ở phía server, không chỉ ẩn nút trên giao diện.', 'Như vậy mỗi vai trò chỉ làm được đúng phần của mình.'],
        status: 'draft',
      },
    ],
    choices: [
      { label: 'Xem chi tiết CA2T', target: { kind: 'project', id: 'ca2t' } },
      { label: 'Hỏi về việc khác', target: { kind: 'node', id: 'how' } },
    ],
  },

  // ── Branch 3: outside work ────────────────────────────────────
  {
    id: 'outside',
    scene: 'apartment',
    posterEnabled: true,
    steps: [
      {
        speaker: 'THỌ',
        lines: ['Mình đã chơi khá nhiều game, từ Famicom/NES đến game hiện đại.', 'Có cả game gacha nữa.'],
        status: 'ready',
        source: 'Thông tin Thọ cung cấp',
      },
    ],
    choices: [...memoryChoices, posterChoice],
  },
  {
    id: 'rat',
    scene: 'workshop',
    steps: [
      {
        speaker: 'NGƯỜI KỂ',
        lines: ['Tấm poster dẫn tới một xưởng máy tưởng tượng.', 'Đây là nhân vật hư cấu, không phải Thọ.'],
        status: 'ready',
      },
      {
        speaker: 'THỢ MÁY',
        lines: ['Bánh răng này kêu hơi to, nhưng máy vẫn chạy.', 'Bạn cứ đi lúc nào cũng được.'],
        status: 'ready',
      },
      {
        speaker: 'NGƯỜI KỂ',
        lines: ['Lý do cảnh này có mặt ở đây: chờ Thọ bổ sung.'],
        status: 'placeholder',
      },
    ],
    choices: [{ label: 'Rời xưởng', hint: 'Về căn phòng', target: { kind: 'node', id: 'outside' } }],
  },
]

export const story: Readonly<Record<NodeId, StoryNode>> = Object.fromEntries(
  nodes.map((n) => [n.id, n]),
) as Record<NodeId, StoryNode>
