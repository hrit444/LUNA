const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const lunaIndex = pc.Index("luna-chat-bot");

async function createMemory({ vectors, metadata, messageId }) {

  await lunaIndex.upsert({
  records: [
    {
      id: String(messageId),
      values: Array.from(vectors).map(Number),
      metadata,
    }
  ]
});
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await lunaIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeMetadata: true,
  });

  return data.matches;
} 

module.exports = { createMemory, queryMemory };
