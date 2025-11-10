import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";  // ✅ nombre exacto


const router = express.Router();

router.post("/", crearProducto);
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;
