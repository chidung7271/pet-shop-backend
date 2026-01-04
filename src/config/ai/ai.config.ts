import { registerAs } from "@nestjs/config";

export default registerAs('ai', () => {
    return {
        geminiApiKey: process.env.GEMINI_API_KEY || "",
    };
});

