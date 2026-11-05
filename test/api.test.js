import {test,after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
let server;const base='http://127.0.0.1:3187';
before(async()=>{server=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:'3187',NODE_ENV:'production',ANTHROPIC_API_KEY:''},stdio:'pipe'});await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Startup timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timeout);resolve()});server.once('error',reject)});});
after(()=>server?.kill());
test('health confirma modo demonstração e catálogo completo',async()=>{
 assert.deepEqual(await (await fetch(base+'/api/health')).json(),{status:'ok',mode:'demo'});
 assert.equal((await (await fetch(base+'/api/agents')).json()).length,18);
});
test('missão retorna plano consolidado e seleção de especialistas',async()=>{
 const response=await fetch(base+'/api/missions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mission:'Criar um app com segurança'})});
 assert.equal(response.status,200);const body=await response.json();assert.equal(body.mode,'demo');assert.ok(body.agents.includes('security'));assert.match(body.text,/Plano de execução/);
});
test('entrada inválida e excessiva é rejeitada',async()=>{
 for(const mission of ['',null,'x'.repeat(6001)]){const r=await fetch(base+'/api/missions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mission})});assert.equal(r.status,400);}
});
test('frontend de produção é servido',async()=>{const r=await fetch(base);assert.equal(r.status,200);assert.match(await r.text(),/JAXYRON/);});
