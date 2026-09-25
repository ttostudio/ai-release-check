// 公開前検証キットの教材: UI を迂回したリクエストもサーバーで検査する。
export function validateReservation(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false, error:'入力形式が正しくありません'};
  if (typeof input.slot !== 'string' || !['午前', '午後'].includes(input.slot)) return {ok:false, error:'時間帯を選択してください'};
  if (!Number.isInteger(input.people) || input.people < 1 || input.people > 4) return {ok:false, error:'人数は1〜4人で指定してください'};
  return {ok:true, slot:input.slot, people:input.people};
}
