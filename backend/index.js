const express = require("express");
const cors = require("cors");
const axios = require("axios");
const OpenAI= require("openai");
const {config} = require("dotenv");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});
const app = express();
const PORT = process.env.PORT || 3000;
config();
app.use(cors());
app.use(express.json());

app.get("/persona", async (req, res) => {
  const { name, about } = req.body;
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

    return res.json(persona);
  } catch (err) {
    // ✅ Axios throws on non-2xx — no need to manually check response.ok
    return res.status(500).json({ error: "Internal server error" });
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
You are a helpful assistant that knows everything about ${persona.name}. 
There is a lot of information about ${persona.name} in the following text: ${persona.about}.
You will be responding to questions like ${persona.name}, a famous person.
You can answer questions about ${persona.name} in a friendly and informative manner.
If you don't know the answer, just say "Sorry, I don't know."

Example Q&A:
1. Who are you?
=> I am ${persona.name}, ${persona.about}.
2. What is your name?
=> My name is ${persona.name}.
3. What do you do?
=> I am a famous person, known for ${persona.about}.
4. Can you tell me more about yourself?
=> Sure! ${persona.about}
5. Do you know me?
=> Sorry, I don't know you but I want to know about you. Who are you?

When answering, think step-by-step like a human. 
Break the answer into steps like this:

{ "step": "analyse", "content": "..." }
{ "step": "think", "content": "..." }
{ "step": "validate", "content": "..." }
{ "step": "result", "content": "..." }

If the user input is a math or logic question, follow chain-of-thought format.
Otherwise, still use this step-by-step reasoning. Stay in character.

ONLY return valid JSON objects in that format.
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];

  let parsedResponse = null;

  try {
    while (true) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });

      const messageContent = response.choices[0].message.content.trim();
      messages.push({ role: "assistant", content: messageContent });

      try {
        parsedResponse = JSON.parse(messageContent);
      } catch (e) {
        return res
          .status(400)
          .json({ error: "Invalid response format from OpenAI" });
      }

      if (parsedResponse.step === "result") {
        break;
      }
    }

    return res.json({ response: parsedResponse.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
