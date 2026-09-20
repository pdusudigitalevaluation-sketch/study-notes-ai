module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  try {
    const { image, subject, topic, date, instruction } = req.body || {};
    if (!image) return res.status(400).json({error:"Image is required"});
    const payload = {
      model: "gpt-5.6-luna",
      input: [{
        role: "user",
        content: [
          {type:"input_text", text:`Convert this study photo into clean structured notes. Subject: ${subject||"unknown"}. Topic: ${topic||"unknown"}. Date: ${date||""}. ${instruction||""} Do not invent facts. Preserve formulas and definitions accurately.`},
          {type:"input_image", image_url:image}
        ]
      }],
      text: {
        format: {
          type:"json_schema",
          name:"study_notes",
          strict:true,
          schema:{
            type:"object", additionalProperties:false,
            properties:{
              title:{type:"string"},
              subject:{type:"string"},
              summary:{type:"string"},
              keyPoints:{type:"array",items:{type:"string"}},
              formulas:{type:"array",items:{type:"string"}},
              revision:{type:"array",items:{type:"string"}},
              date:{type:"string"}
            },
            required:["title","subject","summary","keyPoints","formulas","revision","date"]
          }
        }
      }
    };
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify(payload)
    });
    const data = await r.json();
    if(!r.ok) return res.status(r.status).json({error:data.error?.message||"OpenAI request failed"});
    const text = data.output_text || (data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("");
    return res.status(200).json(JSON.parse(text));
  } catch(e) {
    return res.status(500).json({error:e.message});
  }
};