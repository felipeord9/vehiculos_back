const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const router = express.Router();

// Ruta base en el servidor Linux
const BASE_PATH = '/appvehiculos/PESV';

// Ruta base en carpeta compartida
//const BASE_PATH = '\\\\192.168.4.237\\appvehiculos\\PESV';

// Prevenir navegación por fuera de la carpeta base (Path Traversal Security)
const getSafePath = (relativePath = '') => {
  const normalizedRelative = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const safePath = path.join(BASE_PATH, normalizedRelative);

  if (!safePath.startsWith(BASE_PATH)) {
    throw new Error('Acceso denegado');
  }
  return safePath;
};

// Endpoint para listar archivos/carpetas
router.get('/files/list', (req, res) => {
  try {
    const subPath = req.query.path || '';
    const targetPath = getSafePath(subPath);

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ error: 'La ruta no existe' });
    }

    const items = fs.readdirSync(targetPath, { withFileTypes: true });

    // Separar carpetas y archivos, y ordenarlos alfabéticamente
    const folders = [];
    const files = [];

    items.forEach((item) => {
      if (item.isDirectory()) {
        folders.push({ name: item.name, isFolder: true });
      } else if (item.isFile()) {
        files.push({ name: item.name, isFolder: false });
      }
    });

    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      currentPath: subPath,
      items: [...folders, ...files]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para descargar o previsualizar archivos
router.get('/files/download', (req, res) => {
  try {
    const filePath = req.query.filePath || '';
    const safeFilePath = getSafePath(filePath);

    if (fs.existsSync(safeFilePath) && fs.statSync(safeFilePath).isFile()) {
      res.download(safeFilePath, path.basename(safeFilePath));
    } else {
      res.status(404).send('Archivo no encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports=router