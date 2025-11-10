import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  idProducto: {
    type: String,
    unique: true,
    required: true
  },
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true, default: 0 },
  descripcion: { type: String, default: "" },
  categoria: { type: String, default: "General" }
}, { timestamps: true });


export default mongoose.model("Producto", productoSchema);
