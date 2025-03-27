import React, { useEffect } from 'react';
import OpenAI from "openai";



function Generate_Playlist() {
  const openai = new OpenAI({apiKey:"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",dangerouslyAllowBrowser: true});
  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "developer", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
      store: true,
    });
  
    console.log(completion.choices[0]);
  }
  useEffect(()=>{

    main();
  },[])
  return (
    <div>
      
    </div>
  )
}

export default Generate_Playlist
