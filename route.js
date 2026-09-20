export async function POST(req){
 try{
  const {image}=await req.json();
  if(!image) return Response.json({error:'Image missing'},{status:400});
  const key=process.env.OPENAI_API_KEY;
  if(!key) return Response.json({error:'OPENAI_API_KEY is not configured on the server.'},{status:500});
  const body={
   model:'gpt-5.6-luna',
   input:[{role:'user',content:[
    {type:'input_text',text:'Read this study-note photo carefully. Create clear, faithful study notes. Preserve important facts, formulas, definitions and examples. Do not invent missing text. Return concise structured JSON in the requested schema. If handwriting is unclear, say so in the summary rather than guessing.'},
    {type:'input_image',image_url:image}
   ]}],
   text:{format:{type:'json_schema',name:'study_notes',strict:true,schema:{
    type:'object',additionalProperties:false,
    properties:{
     title:{type:'string'},subject:{type:'string'},summary:{type:'string'},
     keyPoints:{type:'array',items:{type:'string'}},
     formulas:{type:'array',items:{type:'string'}},
     revision:{type:'array',items:{type:'string'}}
    },
    required:['title','subject','summary','keyPoints','formulas','revision']
   }}}
  };
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(body)});
  const d=await r.json();
  if(!r.ok) return Response.json({error:d.error?.message||'OpenAI request failed'},{status:r.status});
  const out=d.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
  if(!out) return Response.json({error:'No structured result returned.'},{status:500});
  return Response.json(JSON.parse(out));
 }catch(e){return Response.json({error:e.message||'Server error'},{status:500})}
}