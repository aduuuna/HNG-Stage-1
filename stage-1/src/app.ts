import express from 'express';
import stage1Routes from "./routes/stage1.route";

const app = express();


app.use(express.json());
app.use("/strings", stage1Routes);



export default app;