import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productoRoutes from "./routes/productoRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/productos", productoRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Conectado a MongoDB Atlas"))
  .catch(err => {
    console.error(" Error al conectar:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
