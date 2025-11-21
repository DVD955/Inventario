import Producto from "../models/producto.js";

/* --- CREAR PRODUCTO --- */
export const crearProducto = async (req, res) => {
  try {
    // 1. Validar que venga el ID
    if (!req.body.idProducto) return res.status(400).json({ mensaje: "ID es requerido" });
    
    // 2. Validar que el ID no exista ya
    const existe = await Producto.findOne({ idProducto: req.body.idProducto });
    if (existe) return res.status(400).json({ mensaje: "ID ya existe" });

    const nuevo = new Producto(req.body);
    const guardado = await nuevo.save();
    res.status(201).json({
      mensaje: "Producto guardado correctamente",
      producto: guardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el producto",
      error: error.message
    });
  }
};

/* --- OBTENER TODOS --- */
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos",
      error: error.message
    });
  }
};

/* --- OBTENER UNO --- */
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el producto",
      error: error.message
    });
  }
};

/* --- ACTUALIZAR (MODIFICADO PARA SEGURIDAD) --- */
export const actualizarProducto = async (req, res) => {
  try {
    
    // 🔒 SEGURIDAD: Evitar que cambien el idProducto
    // Si el usuario intenta enviar un idProducto nuevo, lo borramos de la petición
    // antes de enviarlo a la base de datos.
    if (req.body.idProducto) {
      delete req.body.idProducto;
    }

    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body, // Aquí ya va el objeto limpio (sin idProducto)
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ mensaje: "Producto no encontrado" });
    
    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: actualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto",
      error: error.message
    });
  }
};

/* --- ELIMINAR --- */
export const eliminarProducto = async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el producto",
      error: error.message
    });
  }
};