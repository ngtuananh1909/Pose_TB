/** 18 verified challenges derived from the event organizer's final question set. */
export const LEVELS = [
  { index: 0, title: 'Khởi động', label: 'CẤP 01', point: 10, duration: 30, tone: 'mint', instruction: 'Dùng 4 số khác nhau và 3 dấu phép tính khác nhau. Không dùng ngoặc.' },
  { index: 1, title: 'Tăng tốc', label: 'CẤP 02', point: 20, duration: 30, tone: 'violet', instruction: 'Dùng 5 số khác nhau và đủ 4 dấu +, −, ×, ÷, mỗi dấu đúng 1 lần. Không dùng ngoặc.' },
  { index: 2, title: 'Về đích', label: 'CẤP 03', point: 30, duration: 30, tone: 'amber', instruction: 'Dùng đúng 6 thẻ số và 5 thẻ dấu được nêu trong đề. Không dùng ngoặc. Một chữ số / dấu được lấy tối đa hai lần.' },
];

export const CHALLENGES = [
  { id: 'C1-01', level: 0, target: '37', required: ['×', '−', '÷'], forbidden: '+', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có ×, −, ÷ (mỗi dấu một lần); không dùng +.' },
  { id: 'C1-02', level: 0, target: '14', required: ['+', '−', '÷'], forbidden: '×', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có +, −, ÷ (mỗi dấu một lần); không dùng ×.' },
  { id: 'C1-03', level: 0, target: '30', required: ['×', '+', '−'], forbidden: '÷', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có ×, +, − (mỗi dấu một lần); không dùng ÷.' },
  { id: 'C1-04', level: 0, target: '27', required: ['×', '+', '÷'], forbidden: '−', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có ×, +, ÷ (mỗi dấu một lần); không dùng −.' },
  { id: 'C1-05', level: 0, target: '21', required: ['×', '−', '÷'], forbidden: '+', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có ×, −, ÷ (mỗi dấu một lần); không dùng +.' },
  { id: 'C1-06', level: 0, target: '16', required: ['×', '−', '+'], forbidden: '÷', detail: 'Dùng chính xác 4 số khác nhau. Bắt buộc có ×, −, + (mỗi dấu một lần); không dùng ÷.' },
  ...[['C2-01','17'],['C2-02','26'],['C2-03','32'],['C2-04','28'],['C2-05','18'],['C2-06','25']].map(([id, target]) => ({ id, level: 1, target, detail: 'Dùng đúng 5 số khác nhau và cả 4 dấu (+, −, ×, ÷), mỗi dấu đúng 1 lần. Không dùng ngoặc.' })),
  { id: 'C3-01', level: 2, target: '50', numbers: [1,2,3,5,7,9], operators: ['×','×','+','−','÷'] },
  { id: 'C3-02', level: 2, target: '49', numbers: [2,3,4,6,8,8], operators: ['+','+','−','×','÷'] },
  { id: 'C3-03', level: 2, target: '37', numbers: [1,3,4,5,7,9], operators: ['−','−','+','×','÷'] },
  { id: 'C3-04', level: 2, target: '35', numbers: [2,2,4,5,7,9], operators: ['÷','÷','+','−','×'] },
  { id: 'C3-05', level: 2, target: '43', numbers: [1,4,4,6,7,9], operators: ['×','×','+','−','÷'] },
  { id: 'C3-06', level: 2, target: '42', numbers: [1,2,3,5,8,9], operators: ['+','+','−','×','÷'] },
];

export function getChallenge(id) { return CHALLENGES.find(c => c.id === id) ?? null; }
export function getByLevel(level) { return CHALLENGES.filter(c => c.level === level); }
