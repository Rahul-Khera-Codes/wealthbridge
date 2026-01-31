const { MongoClient } = require('mongodb');
const { OpenAI } = require('langchain/llms/openai');
const { Chain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');

const uri = 'mongodb://localhost:27017';
const dbName = 'investmentDB';
const client = new MongoClient(uri);

const investmentRecommendations = async (userPreferences) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('investmentData');

        const investments = await collection.find({}).toArray();

        const promptTemplate = new PromptTemplate({
            template: "Based on the following user preferences: {userPreferences}, recommend suitable investments from the provided data: {investmentData}",
            inputVariables: ['userPreferences', 'investmentData'],
        });

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const chain = new Chain({
            llm: openai,
            prompt: promptTemplate,
        });

        const investmentData = JSON.stringify(investments);
        const response = await chain.call({
            userPreferences: JSON.stringify(userPreferences),
            investmentData: investmentData,
        });

        return response.text;
    } catch (error) {
        console.error('Error in investmentRecommendations:', error);
        throw new Error('Failed to generate investment recommendations');
    } finally {
        await client.close();
    }
};

module.exports = {
    investmentRecommendations,
};