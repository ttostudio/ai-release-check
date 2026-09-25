import {validateReservation} from '../../../lib/validate.mjs';

export async function POST(request) {
  let input;
  try { input = await request.json(); }
  catch { return Response.json({error:'JSON形式で送信してください'}, {status:400}); }
  const result = validateReservation(input);
  if (!result.ok) return Response.json({error:result.error}, {status:400});
  // 教材用の模擬応答。予約確定・在庫管理・個人情報保存はしない。
  return Response.json({message:`${result.slot}・${result.people}人の入力を確認しました（予約は確定していません）`});
}
