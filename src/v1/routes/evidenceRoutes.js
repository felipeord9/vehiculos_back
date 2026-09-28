const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/preoperacional/'); // Ruta personalizada
  },
  filename: (req, file, cb) => {
    const filename = req.body.name || 'evidence';
    cb(null, `${filename}.webm`);
  }
});

/* const upload = multer({ storage }); */
const upload = multer({ limits: { fileSize: 1024 * 1024 * 500 } ,  dest: 'uploads/' });

router.post('/', upload.fields([
    { name: 'factura', maxCount: 1 },
    { name: 'evidence', maxCount: 1 },
    { name: 'firmaConductor', maxCount: 1 },
    { name: 'firmaJefe', maxCount: 1 },
  ]), (req, res) => {
  console.log('entro a la ruta');
  const id = req.body.id;

  console.log(`id: ${id}`);

  const evidenceFile = req.files?.evidence?.[0];
  const firmaConductorFile = req.files?.firmaConductor?.[0];
  const firmaJefeFile = req.files?.firmaJefe?.[0];

  /* if (!evidenceFile) {
    return res.status(400).send('Faltan archivos (factura o evidence)');
  } */

  const ruta = `/preoperacional/${id}`

  const outputFactura = path.join(ruta, `bill_${id}.jpg`);
  const outputEvidence = path.join(ruta, `evidence_${id}.webm`);
  const outputFirmaConductor = path.join(ruta, `firma_conductor_${id}.png`);
  const outputFirmaJefe = path.join(ruta, `firma_jefe_${id}.png`);
  /* const outputPath = inputPath.replace('.webm', '.mp4'); */

  try {
    //crear el directorio si no esta o utilizar el que ya esta
    if (!fs.existsSync(ruta)) {
        console.log('se crea la carpeta');
        fs.mkdirSync(ruta, { recursive: true });
    }

    console.log('la carpeta ya esta creada');

    // Mover ambos archivos
    if(evidenceFile){
      fs.renameSync(evidenceFile.path, outputEvidence);
    }
    if(firmaJefeFile){
      fs.renameSync(firmaJefeFile.path, outputFirmaJefe);
    }
    if(firmaConductorFile){
      fs.renameSync(firmaConductorFile.path, outputFirmaConductor);
    }
  
    //fs.unlinkSync(inputPath); // Elimina el archivo .webm temporal
    console.log('archivo guardado');
    res.status(200).json({
      message: 'OK'
    })

  } catch (err) {
    console.error('Error general al procesar archivos:', err);

    // 5. Limpieza de emergencia de los temporales que multer guardó
    const allFiles = [evidenceFile, firmaConductorFile, firmaJefeFile, facturaFile];
    allFiles.forEach(file => {
      if (file?.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.error('Error al limpiar archivo temporal:', e);
        }
      }
    });

    return res.status(500).json({ error: 'Error interno al procesar los archivos' });
  }
});

// GET único video
router.get('/file', (req, res) => {
  const { folder, filename } = req.query;

  console.log(`si llegaron los parametros`)

  if (!folder || !filename) {
    return res.status(400).send('Faltan parámetros');
  }

  const safeFolder = path.basename(folder); // evita rutas maliciosas
  const safeFilename = path.basename(filename);
  const videoPath = path.join('/evidencias', folder, filename);

  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Video no encontrado');
    }
    res.sendFile(videoPath);
  });
});

router.get('/obtener-archivo/:archivo', (req, res) => {
  const { archivo } = req.params;
  const number = Number(archivo.match(/\d+$/)?.[0]);
  console.log(number)

  if (!archivo) {
    return res.status(400).send('Faltan parámetros');
  }

  // 1. Asegurar la extensión .webm si el usuario no la envió en la URL
  const nombre = archivo.endsWith('.webm') ? archivo : `${archivo}.webm`;

  // 2. Construir la ruta absoluta real dentro de la carpeta del proyecto
  const videoPath = path.join(`/preoperacional/${number}`, nombre);

  console.log('Buscando video en:', videoPath);

  // 3. Verificar la existencia del archivo
  fs.stat(videoPath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.error('El video no existe en el servidor:', videoPath);
      return res.status(404).send('Archivo no encontrado');
    }

    // 4. Enviar el archivo especificado con su ruta absoluta
    res.sendFile(videoPath, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        if (!res.headersSent) {
          res.status(500).send('Error al transmitir el video');
        }
      }
    });
  });
});

const FILES_DIR = '/preoperacional'

router.get('/consult/evidence/:archivo', (req, res) => {
  const { archivo } = req.params;

  if (!archivo) {
    console.log('faltan archivos')
    return res.status(400).send('Faltan parámetros');
  }

  console.log(`enviado:${archivo}`)

  const videoPath2 = path.join('/preoperacional', `${archivo}.webm`);

  console.log(`nombre:${videoPath2}`)

  fs.access(videoPath2, fs.constants.F_OK, (err) => {
    if(err){
      return res.status(404).send('Video no encontrado');
    }
    res.sendFile(videoPath2);
  })

});

router.use('/videos', express.static('/preoperacional'));

module.exports=router
