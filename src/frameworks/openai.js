import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const compareProducts = async (products, question) => {
    const productsStr = products.map(product => JSON.stringify(product)).join(', ');
    const prompt = `Productos: ${productsStr} Accion: ${question}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "Eres un asistente experto en comparar productos para elegir la mejor compra." },
                { "role": "user", "content": prompt }
            ]
        });

        const answer = response.choices[0].message.content.trim();
        const tokensUsed = response.usage.total_tokens;
        console.info({"promt":prompt, "answer": answer, "tokens":tokensUsed});
        return JSON.parse(answer);
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
};

export default compareProducts;
