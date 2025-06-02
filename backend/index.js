const express = require("express");
const cors = require("cors");
const axios = require("axios");
const OpenAI= require("openai");
const {config} = require("dotenv");
config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.post("/persona", async (req, res) => {
  const { name, about } = req.body;
  console.log(req.body)
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    name
  )}`;

  try {
    const response = await axios.get(url); // ✅ axios automatically parses JSON

    const data = response.data;

    if (!data.extract) {
      return res
        .status(404)
        .json({ error: "Sorry, I think this is not a famous person" });
    }

    const combinedAbout = `${about}. ${data.extract}`;

    const persona = {
      name: data.title || name,
      about: combinedAbout,
      image: data.thumbnail ? data.thumbnail.source : null,
    };

    res.json(persona);
  } catch (err) {
    // ✅ Axios throws on non-2xx — no need to manually check response.ok
      console.error("Error fetching persona data:", err.message || err);
     res.status(500).json({ error: "Internal server error" });
  }
});

// after that persona is ready you can start chatting with it


app.post("/chat", async (req, res) => {
  const { persona, query } = req.body;

  if (!persona || !persona.name || !persona.about) {
    return res.status(400).json({ error: "Invalid persona data" });
  }

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query" });
  }

  const systemPrompt = `
You are an assistant who acts exactly like ${persona.name}. 

You will respond **in the tone and style of ${persona.name}**, using common phrases they often say. If they are known for speaking in Hindi, respond in Hinglish (Hindi in Roman script), otherwise use English. 

You must reply as if **you are ${persona.name}** talking directly to the user.
Do bit research about that person.

Do not explain anything.
Do not say you're an assistant.
Do not add any greetings or extra commentary.

Respond ONLY with this JSON format:
{
  "response": "your reply as ${persona.name}"
}
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];
  console.log(messages)
  let parsedResponse = null;

  try {
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });

      const messageContent = response.choices[0].message.content.trim();
      messages.push({ role: "assistant", content: messageContent });
      
      try {
        parsedResponse = JSON.parse(messageContent);
        
        return res.json({ response: parsedResponse.response });
        
      } catch (e) {
        return res.status(400).json({ error: "Invalid response format from OpenAI" });
      }

      
        
      
    

    
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
