import { registerAs } from "@nestjs/config";


export default registerAs('database', () => {
    return{
        url: process.env.MONGO_URL || "http://localhost:27017",
    }
}
    )
