// 本番ビルドを npm run start -- --port 3197 で起動してから実行する。
import assert from 'node:assert/strict';
const base=process.env.BASE_URL || 'http://127.0.0.1:3197';
const page=await fetch(base);
assert.equal(page.status,200);
assert.match(await page.text(),/予約入力デモ/);
console.log('GET /: 200 日本語画面あり');
for (const [input,expected] of [
  [{slot:'午前',people:2},200],
  [{slot:'午前',people:5},400],
  [{slot:'夜',people:2},400],
]) {
  const response=await fetch(base+'/api/reservation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  assert.equal(response.status,expected);
  const body=await response.json();
  assert.equal(typeof (body.message || body.error),'string');
  console.log(`POST /api/reservation ${JSON.stringify(input)}: ${response.status} ${JSON.stringify(body)}`);
}
const broken=await fetch(base+'/api/reservation',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
assert.equal(broken.status,400);
console.log('不正なJSON: 400');
