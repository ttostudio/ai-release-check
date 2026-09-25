import test from 'node:test';
import assert from 'node:assert/strict';
import {validateReservation} from '../lib/validate.mjs';
test('有効な時間帯と人数だけを受け付ける',()=>{
  assert.deepEqual(validateReservation({slot:'午前',people:2}),{ok:true,slot:'午前',people:2});
});
test('画面の制約を回避した人数を拒否する',()=>{
  for (const people of [0,5,-1,1.5,'2',null]) assert.equal(validateReservation({slot:'午前',people}).ok,false);
});
test('想定外の時間帯と入力形式を拒否する',()=>{
  for (const input of [null,[],{slot:'夜',people:2},{slot:'午後'}]) assert.equal(validateReservation(input).ok,false);
});
