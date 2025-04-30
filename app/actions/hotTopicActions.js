import { GoogleGenerativeAI } from '@google/generative-ai';


export async function fetchHotTopic( page=1) {
    try {
        
        if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
            throw new Error("API key is not defined in the environment variables.");
        }
        const response = await fetch(`https://newsapi.org/v2/everything?q=(trending+OR+viral+OR+%22breaking+news%22)+-rumor&from=2025-04-15&sortBy=popularity&language=en&pageSize=7&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.articles) {
            throw new Error("Invalid response structure from the API.");
        }
        let articles = data.articles;
        for (let i = 0; i < articles.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const article = articles[i];
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `
    Summarize the following news article in 10 to 15 concise lines. 
    Focus only on the most important and relevant information, removing any fluff or filler. 
    Maintain the core context, mention any involved individuals, companies, or events, and write in a clear, news-style tone.

    Here is the article content:
    "${article.content}"
  `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();

            article.summary = summary;
        }
        
        // console.log("Articles with summaries:", articles);
        return {
            data: articles,
            success:true
        }

    } catch (error) {
        console.error("Error fetching hot topics:", error);
        return {
            data: [],
            success:false,
            error:error.message
        }
       

    }
}