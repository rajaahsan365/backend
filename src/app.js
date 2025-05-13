import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user_routes.js";
import videoRoutes from "./routes/video_routes.js";
import { ErrorHandler } from "./middlewares/error_middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/video", videoRoutes);

app.use(ErrorHandler);

export { app };
