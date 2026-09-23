export const checks = [
  {id:'goal', category:'企画', text:'対象ユーザーと「できること・できないこと」を一文で説明できる', why:'用途の誤解や無理な利用を防ぐ'},
  {id:'flow', category:'企画', text:'主要操作を最初から最後まで実際に試した', why:'画面単位では見えない行き止まりを見つける'},
  {id:'empty', category:'画面', text:'データが0件のときの表示と次の操作がある', why:'初回利用で止まらないため'},
  {id:'loading', category:'画面', text:'通信待ち・失敗・再試行の表示がある', why:'回線不調でも利用者が判断できる'},
  {id:'mobile', category:'画面', text:'スマートフォン幅で入力・操作・読み取りを確認した', why:'PCだけで成立する誤りを避ける'},
  {id:'keyboard', category:'画面', text:'キーボードだけで主要操作を完了できる', why:'操作方法によらず利用できるようにする'},
  {id:'auth', category:'権限', text:'ログインしない状態で保護ページ・APIが見えない', why:'画面非表示だけではアクセス制御にならない'},
  {id:'owner', category:'権限', text:'他人のデータIDを指定しても閲覧・変更できない', why:'所有者を跨ぐデータ漏えいを防ぐ'},
  {id:'admin', category:'権限', text:'管理者専用操作を一般ユーザーで実行できない', why:'UI以外のAPI直接呼出しも防ぐ'},
  {id:'secrets', category:'データ', text:'APIキー・秘密情報を公開コードとブラウザに含めていない', why:'キーの不正利用と課金事故を防ぐ'},
  {id:'personal', category:'データ', text:'保存する個人情報と削除方法を把握している', why:'不要な収集や削除不能を避ける'},
  {id:'backup', category:'データ', text:'必要なデータの復元手順を実際に確認した', why:'障害時にデータを戻せるか確かめる'},
  {id:'limit', category:'運用', text:'AI/APIの利用回数・料金の上限や警告を設定した', why:'悪用や無限実行による費用増を抑える'},
  {id:'errorlog', category:'運用', text:'本番エラーを検知する手段があり個人情報をログに出さない', why:'障害に気づきつつ漏えいを避ける'},
  {id:'rollback', category:'運用', text:'公開を戻す手順を試した', why:'不具合時にすばやく被害を抑える'},
  {id:'tests', category:'検証', text:'型検査・テスト・本番ビルドが成功している', why:'開発中だけ動く状態を避ける'},
  {id:'browser', category:'検証', text:'実ブラウザで主要フローと失敗状態を確認した', why:'コード上の推測と利用時の挙動を分ける'},
  {id:'evidence', category:'検証', text:'実行コマンド、結果、確認日時を保存した', why:'後から再現・再確認できるようにする'},
  {id:'policy', category:'公開', text:'利用規約・プライバシー案内を実態に合わせて確認した', why:'実際のデータ取扱いを説明する'},
  {id:'payment', category:'公開', text:'課金・解約・返金・問い合わせ導線を確認した（課金がない場合は対象外）', why:'有料サービス利用者の判断と救済を助ける'}
];
export const states = ['未確認','確認済み','要対応','対象外'];
export function summarize(answers) {
  const counts = Object.fromEntries(states.map(s => [s, 0]));
  for (const check of checks) counts[states.includes(answers?.[check.id]) ? answers[check.id] : '未確認']++;
  return {counts, remaining: counts['未確認'] + counts['要対応'], total: checks.length};
}
export function report(project, answers, date = new Date().toISOString()) {
  const s = summarize(answers);
  const safe = String(project || '名称未設定').replace(/[\r\n]+/g, ' ').slice(0, 100);
  const lines = [`# 公開前セルフチェック: ${safe}`, '', `作成日時: ${date}`, `確認済み ${s.counts['確認済み']} / 要対応 ${s.counts['要対応']} / 未確認 ${s.counts['未確認']} / 対象外 ${s.counts['対象外']}`, '', '※ 自己申告の記録です。自動スキャン・安全性の保証・法律判断ではありません。', '※ 要対応/未確認を解消するまで公開可否を慎重に判断してください。', ''];
  for (const check of checks) lines.push(`- [${answers?.[check.id] === '確認済み' ? 'x' : ' '}] ${check.category} / ${check.text} — ${states.includes(answers?.[check.id]) ? answers[check.id] : '未確認'}（${check.why}）`);
  return lines.join('\n') + '\n';
}
