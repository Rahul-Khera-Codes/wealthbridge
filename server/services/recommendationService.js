const { MongoClient } = require('mongodb');
const { OpenAI } = require('langchain/llms/openai');
const { ConversationChain } = require('langchain/chains');
const { ChatPromptTemplate } = require('langchain/prompts');

const uri = 'mongodb://localhost:27017';
const dbName = 'investmentDB';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to database');
        return client.db(dbName);
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
}

async function getInvestmentRecommendations(userInput) {
    const db = await connectToDatabase();
    const recommendationsCollection = db.collection('recommendations');

    const model = new OpenAI({ temperature: 0.7 });
    const prompt = ChatPromptTemplate.fromTemplate('Based on the following user input: {input}, provide investment recommendations.');
    const chain = new ConversationChain({ llm: model, prompt });

    try {
        const response = await chain.call({ input: userInput });
        const recommendations = response.text;

        await recommendationsCollection.insertOne({ userInput, recommendations });
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    } finally {
        await client.close();
    }
}

module.exports = {
    getInvestmentRecommendations,
};