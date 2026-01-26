const { MongoClient } = require('mongodb');
const { OpenAI } = require('langchain/llms/openai');
const { ConversationChain } = require('langchain/chains');
const { ChatPromptTemplate } = require('langchain/prompts');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'investmentDB';
const collectionName = 'investmentData';

const openai = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const recommendationChain = new ConversationChain({
  llm: openai,
  prompt: ChatPromptTemplate.fromTemplate('Based on the following data: {data}, what investment recommendations can you provide?'),
});

async function getInvestmentRecommendations(userInput) {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const investmentData = await collection.find({}).toArray();
    if (!investmentData.length) {
      throw new Error('No investment data found');
    }

    const recommendations = await recommendationChain.call({ data: JSON.stringify(investmentData) });
    return recommendations;
  } catch (error) {
    console.error('Error getting investment recommendations:', error);
    throw new Error('Failed to get investment recommendations');
  } finally {
    await client.close();
  }
}

module.exports = {
  getInvestmentRecommendations,
};