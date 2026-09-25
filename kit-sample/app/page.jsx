'use client';
import {useState} from 'react';
export default function Home() {
  const [slot,setSlot]=useState('午前');
  const [people,setPeople]=useState('1');
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setStatus('確認中…');
    try {
      const response=await fetch('/api/reservation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slot,people:Number(people)})});
      const data=await response.json(); setStatus(response.ok?data.message:(data.error||'入力を確認してください'));
    } catch {setStatus('通信に失敗しました。接続を確認して再試行してください')}
    finally {setBusy(false)}
  }
  return <main><h1>予約入力デモ</h1><p>公開前検証キットの教材です。予約は成立せず、入力は保存されません。</p><form onSubmit={submit}><label htmlFor="slot">時間帯</label><select id="slot" value={slot} onChange={e=>setSlot(e.target.value)}><option>午前</option><option>午後</option></select><label htmlFor="people">人数（1〜4人）</label><input id="people" type="number" min="1" max="4" required value={people} onChange={e=>setPeople(e.target.value)}/><button disabled={busy}>入力を確認</button></form><p role="status" aria-live="polite">{status}</p><aside><h2>この教材で確かめること</h2><p>画面の人数制限を回避してAPIへ直接送っても、サーバーが不正な人数を拒否するかを確認します。成功メッセージは予約確定を意味しません。</p></aside></main>
}
