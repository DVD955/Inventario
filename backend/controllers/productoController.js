import Producto from "../models/producto.js";


export const crearProducto = async (req, res) => {
  try {
    
    if (!req.body.idProducto) return res.status(400).json({ mensaje: "ID es requerido" });
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


export const actualizarProducto = async (req, res) => {
  try {
   
    if (req.body.idProducto) {
      const existe = await Producto.findOne({ idProducto: req.body.idProducto, _id: { $ne: req.params.id } });
      if (existe) return res.status(400).json({ mensaje: "ID ya existe" });
    }

    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
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
