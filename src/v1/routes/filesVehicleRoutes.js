const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const cors = require('cors');
const rimraf = require('rimraf');
const fsExtra = require('fs-extra');
const { execSync } = require('child_process');
const { promisify } = require('util');

const router = express.Router();

//const upload = multer({ dest: 'uploads/' });
const upload = multer({ dest: '/appvehiculos/' });

router.post('/', upload.fields([
    /* second form */
    { name: 'soat' },
    { name: 'tecno' },
    { name: 'fumigacion' },
    { name: 'saneamientoCarnico' },
    { name: 'saneamientoPesquero' },
    { name: 'poliza' },
    { name: 'invima' },
    { name: 'limpiezaDesinfeccion' },
    { name: 'tarjetaPropiedad' },
  ]), async (req, res) => {
    try {
        const { placa } = req.body;

        // 1. Validar que vengan los datos obligatorios
        if (!placa) {
          console.log(placa)
            return res.status(400).send('Faltan datos obligatorios: placa');
        }
            
        // En Linux la ruta debe ser absoluta y existir
        const targetPath = path.join('/appvehiculos/VEHICULOS', placa);
    
        // 1. Asegurar que la carpeta destino exista (mkdir -p)
        await fsExtra.ensureDir(targetPath);
    
        // 2. Procesar los archivos usando for...of (SÍ espera a que termine cada uno)
        if (req.files) {
            const categories = Object.keys(req.files);
                
            for (const category of categories) {
                const files = req.files[category];
                    
                for (const file of files) {
                    const extension = path.extname(file.originalname);
                    const finalFileName = `${file.fieldname}${extension}`;
                    const finalDest = path.join(targetPath, finalFileName);
    
                    // Mover de /tmp a la carpeta final (atómico y seguro)
                    await fsExtra.move(file.path, finalDest, { overwrite: true });
                }
            }
        }
    
        console.log(`✅ Archivos para la cédula ${placa} procesados con éxito.`);
        return res.status(200).send('Archivos guardados correctamente');
    
    } catch (error) {
        console.error('❌ Error en el servidor:', error);
        return res.status(500).send('Error interno al procesar archivos');
    }
    
    console.log('Carpeta enviada correctamente.');
});

// GET /pesv/files/check/:placa
router.get('/check/:placa', (req, res) => {
  try {
    const { placa } = req.params;
    const folderPath = path.join('/appvehiculos/VEHICULOS', placa);

    const availableDocs = {
      soat: null,
      tecno: null,
      fumigacion: null,
      saneamientoCarnico: null,
      saneamientoPesquero: null,
      poliza: null,
      invima: null,
      limpiezaDesinfeccion: null,
      tarjetaPropiedad: null,
    };

    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);

      files.forEach((file) => {
        const nameWithoutExt = path.parse(file).name;
        if (availableDocs.hasOwnProperty(nameWithoutExt)) {
          // Si el archivo existe, guardamos su información
          availableDocs[nameWithoutExt] = {
            name: file,
            isExisting: true, // Bandera para diferenciar de un File nativo
          };
        }
      });
    }

    return res.status(200).json(availableDocs);
  } catch (error) {
    console.error('Error al verificar documentos:', error);
    return res.status(500).send('Error al consultar archivos');
  }
});

// Define el directorio base absoluto
const BASE_DIRECTORY = path.resolve('/appvehiculos'); 

const getSafePath = (userPath) => {
  // path.resolve resuelve la ruta absoluta según el SO
  const safePath = path.resolve(BASE_DIRECTORY, userPath);
  
  // Verifica si safePath está dentro de BASE_DIRECTORY
  if (!safePath.startsWith(BASE_DIRECTORY)) {
    throw new Error('Acceso no permitido');
  }
  return safePath;
};

router.get('/download', (req, res) => {
  try {
    const filePath = req.query.filePath || '';
    
    if (!filePath) {
      return res.status(400).send('Ruta de archivo no proporcionada');
    }

    const safeFilePath = getSafePath(filePath);

    if (fs.existsSync(safeFilePath) && fs.statSync(safeFilePath).isFile()) {
      return res.download(safeFilePath, path.basename(safeFilePath));
    } else {
      return res.status(404).send('Archivo no encontrado');
    }
  } catch (error) {
    console.error('Error en descarga:', error.message);
    return res.status(500).send(error.message);
  }
});

/* eliminar una carpeta */
router.delete('/:folderName', (req,res)=>{
    const folderName = req.params.folderName;
    //const rutaArchivo = path.join(`C:/Users/Practicante 2/Downloads/${folderName}`);
  const folderPath = path.join(`/appvehiculos/VEHICULOS/${folderName}`);
  
    fsExtra.remove(rutaArchivo)
      .then(() => {
        console.log('Carpeta eliminada correctamente');
      })
      .catch((err) => {
        console.error(`Error al eliminar la carpeta: ${err.message}`);
      });if (err) {
        console.error(err);
        return res.status(500).send('Error al eliminar la carpeta');
      }
});

module.exports=router
  