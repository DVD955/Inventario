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

// ⚠️ ID manual: no generamos automáticamente
// Puedes dejar este pre-save si quieres IDs automáticos opcionales
/*
productoSchema.pre("save", async function(next) {
  if (!this.idProducto) {
    const ultimo = await mongoose.model("Producto").findOne().sort({ createdAt: -1 });
    let nuevoNumero = 1;
    if (ultimo && ultimo.idProducto) {
      const num = parseInt(ultimo.idProducto.replace("P-", ""));
      if (!isNaN(num)) nuevoNumero = num + 1;
    }
    this.idProducto = "P-" + String(nuevoNumero).padStart(6, "0");
  }
  next();
});
*/

export default mongoose.model("Producto", productoSchema);
