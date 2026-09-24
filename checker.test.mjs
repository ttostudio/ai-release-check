import test from 'node:test';
import assert from 'node:assert/strict';
import {checks, states, summarize, report} from './checker.mjs';
test('項目IDが重複せず20件である', () => {assert.equal(checks.length,20);assert.equal(new Set(checks.map(c=>c.id)).size,checks.length);assert.ok(checks.every(c=>c.text && c.why && c.category))});
test('未回答や不正な状態は未確認として集計する', () => {const s=summarize({goal:'確認済み',auth:'偽'});assert.equal(s.total,20);assert.equal(s.counts['確認済み'],1);assert.equal(s.counts['未確認'],19);assert.deepEqual(Object.keys(s.counts),states)});
test('要対応と未確認を残件として扱う', () => {const s=summarize({goal:'要対応',flow:'対象外',empty:'確認済み'});assert.equal(s.remaining,18)});
test('報告書は自己申告を明記し改行した名称を1行にする', () => {const text=report('案件\n別行',{auth:'要対応',goal:'確認済み'},'2026-09-24');assert.match(text,/案件 別行/);assert.match(text,/自己申告/);assert.match(text,/権限 \/ ログインしない状態/);assert.match(text,/- \[x\] 企画/);assert.match(text,/作成日時: 2026-09-24/)});
test('報告書は要対応を先に並べ未確認に証跡欄を用意する', () => {const text=report('試験',{goal:'確認済み',auth:'要対応',flow:'不正'},'2026-09-24');const todo=text.split('## 全項目の回答')[0];assert.match(todo,/## 次に確認すること/);assert.ok(todo.indexOf('【要対応】権限') < todo.indexOf('【未確認】企画'));assert.match(todo,/確認方法・実行結果・日付: （あとで記入）/);assert.doesNotMatch(todo,/【未確認】企画 \/ 対象ユーザー/);assert.match(todo,/【未確認】企画 \/ 主要操作/)});
test('残件なしの場合も安全宣言はしない', () => {const answers=Object.fromEntries(checks.map(c=>[c.id,'対象外']));const text=report('試験',answers,'2026-09-24');assert.match(text,/対象外の妥当性と確認済みの根拠を見直して/);assert.doesNotMatch(text,/【未確認】/)});
