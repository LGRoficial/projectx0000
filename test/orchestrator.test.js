import {test} from 'node:test';
import assert from 'node:assert/strict';
import {agents,selectAgents,demoResponse} from '../server/orchestrator.js';
test('18 agentes únicos distribuídos nas quatro camadas',()=>{
 assert.equal(agents.length,18);assert.equal(new Set(agents.map(a=>a.id)).size,18);
 assert.deepEqual(['CORE','NEGÓCIOS','MARKETING','TECNOLOGIA'].map(l=>agents.filter(a=>a.layer===l).length),[5,5,5,3]);
});
test('missões selecionam especialistas relevantes e o gerente',()=>{
 assert.deepEqual(selectAgents('Desenvolver um app com segurança'),['manager','developer','security']);
 assert.ok(selectAgents('Automatizar vendas por email').includes('automator'));
 assert.ok(selectAgents('Automatizar vendas por email').includes('email'));
});
test('missão genérica tem equipe padrão e demo declara seus limites',()=>{
 const selected=selectAgents('Olá');assert.deepEqual(selected,['manager','strategist','writer']);
 const response=demoResponse('Minha missão',selected);assert.match(response,/Minha missão/);assert.match(response,/Nenhuma ação externa foi executada/);
});
