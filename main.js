import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import { app } from "./src/app.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 3000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
