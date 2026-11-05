import express from 'express';
import {agents,selectAgents,demoResponse} from './orchestrator.js';
const app=express();
app.use(express.json({limit:'64kb'}));
app.get('/api/health',(_,res)=>res.json({status:'ok',mode:process.env.ANTHROPIC_API_KEY?'live':'demo'}));
app.get('/api/agents',(_,res)=>res.json(agents));
app.post('/api/missions',async(req,res)=>{
 const {mission,history=[]}=req.body;
 if(typeof mission!=='string'||!mission.trim()||mission.length>6000||!Array.isArray(history)) return res.status(400).json({error:'Envie uma missão de até 6.000 caracteres.'});
 const selected=selectAgents(mission);
 if(!process.env.ANTHROPIC_API_KEY)return res.json({text:demoResponse(mission,selected),agents:selected,mode:'demo'});
 try{
 const messages=history.slice(-12).filter(m=>['user','assistant'].includes(m.role)&&typeof m.content==='string').map(m=>({role:m.role,content:m.content.slice(0,12000)}));
 messages.push({role:'user',content:mission});
 const response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',signal:AbortSignal.timeout(60000),headers:{'content-type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-20250514',max_tokens:3000,system:`Você é JAXYRON, uma plataforma de planejamento e execução assistida. Responda em português, com clareza e entregas concretas em Markdown. Orquestre papéis especializados em uma única resposta. Agentes selecionados: ${selected.join(', ')}. Não afirme ter executado ações externas ou criado arquivos sem ferramentas. Diferencie propostas, hipóteses e resultados. Solicite informações essenciais quando necessário.`,messages})});
 if(!response.ok)throw new Error(`Provider HTTP ${response.status}`);
 const data=await response.json();const text=data.content?.filter(b=>b.type==='text').map(b=>b.text).join('\n');
 if(!text)throw new Error('Empty provider response');
 res.json({text,agents:selected,mode:'live'});
 }catch(error){console.error('Falha no provedor:',error.message);res.status(502).json({error:'Não foi possível concluir a missão com o provedor de IA. Verifique a configuração e tente novamente.'});}
});
if(process.env.NODE_ENV==='production'){app.use(express.static('dist'));app.get('/{*path}',(_,res)=>res.sendFile('index.html',{root:'dist'}));}
else {const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
app.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('JAXYRON disponível na porta '+(process.env.PORT||3000)));
