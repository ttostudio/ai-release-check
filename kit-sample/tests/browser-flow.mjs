// npm run start -- --port 3197 を別端末で起動してから実行する。
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:3197';
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL === 'chromium' ? {} : {channel:'chrome'});
const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await mkdir('evidence/browser', {recursive:true});
  await page.goto(base);
  assert.equal(await page.getByRole('heading',{name:'予約入力デモ'}).count(), 1);
  await page.screenshot({path:'evidence/browser/initial.png',fullPage:true});

  await page.getByLabel('時間帯').selectOption('午後');
  await page.getByLabel('人数（1〜4人）').fill('2');
  await page.getByRole('button',{name:'入力を確認'}).click();
  await page.getByRole('status').getByText('午後・2人の入力を確認しました（予約は確定していません）').waitFor();
  await page.screenshot({path:'evidence/browser/success.png',fullPage:true});
  console.log('画面正常系: 成功文言を確認');

  // HTML の max 制限を通らない API 直送では、サーバー自身が拒否する必要がある。
  const invalid = await page.request.post(base+'/api/reservation',{data:{slot:'午前',people:5}});
  assert.equal(invalid.status(),400);
  assert.match((await invalid.json()).error,/人数/);
  console.log('画面制限を回避したAPI送信: 400 を確認');

  await page.route('**/api/reservation', route => route.abort('failed'));
  await page.getByRole('button',{name:'入力を確認'}).click();
  await page.getByRole('status').getByText('通信に失敗しました。接続を確認して再試行してください').waitFor();
  assert.equal(await page.getByRole('button',{name:'入力を確認'}).isEnabled(),true);
  await page.screenshot({path:'evidence/browser/network-failure.png',fullPage:true});
  console.log('通信失敗: エラー表示と再試行可能状態を確認');
  assert.deepEqual(errors,[]);
  console.log('ブラウザ例外: なし');
} finally {
  await browser.close();
}
