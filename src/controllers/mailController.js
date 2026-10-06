const mailService = require("../services/mailService");
const { config } = require("../config/config");
const nodemailer = require("nodemailer");

const sendMail = async (req, res, next) => {
  try {
    const { body } = req.body;
    const { id } = req.idToken;

    console.log(body)

    const payload = {
      id: id
    }

    console.log(payload)

    const token = jwt.sign(payload, config.jwtSecret,{ expiresIn: "24h" })

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          * {
          font-size: 8px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          thead {
            background-color: #d6d6d6;
            color: #000;
          }
          tbody {
            display: block;
            min-height: 100vh;
          }
          tr {
            display: table;
            width: 100%;
            table-layout: fixed;

          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
        </style>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            padding: 1rem 2rem;
          "
        >
          <h1 style="text-align: center; font-size: 13px; font-weight: bold">DEVOLUCIONES Y AVERÍAS</h1>
          <p style="text-align: center; margin: 0.3rem 0;">Nota: Este documento no corresponde a una requisición o nota crédito</p>
          <div style="position: relative; font-size: 8px; width: 100%; height: 100%;">
            <div style="margin: auto;">
              <h2 style="font-size: 8px; font-weight: bolder; margin: 0">
                EL GRAN LANGOSTINO S.A.S.
              </h2>
              <p style="margin: 0.3rem 0;"><strong>Nit: 835001216</strong></p>
              <p style="margin: 0.3rem 0;">Tel: 5584982 - 3155228124</p>
            </div>
            <div
              style="
                position: absolute;
                border: 1px solid black;
                width: 200px;
                top: 0;
                right: 0;
              "
            >
              <p style="padding: 0.2rem 0.5rem; margin: 0; white-space: nowrap;"><strong>Fecha creación: </strong>${new Date().toLocaleString(
                "es-CO"
              )}</p>
            </div>
          </div>
          <hr style="width: 100%; border: 1.5px solid black;"/>
          <div style="width: 100%; font-size: 13px; margin-top: 10px;">
            <div style="position: relative; margin-bottom: 2rem;">
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; padding: 1rem;">
                <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Solicitante</h3>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nit: </strong>${
                    body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nombre: </strong>${
                    body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Sucursal: </strong>${
                    body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Fecha creación: </strong>${
                    new Date(body.createdAt).toLocaleString("es-CO")
                  }</p>
                </div>
              </div>
            </div>
            <div style="width: 100%; border: 1px solid black;">
              <table style="width: 100%; height: 100%;">
                <thead>
                  <tr>
                    <th style="width: 30px;">Ref.</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>UM</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  ${body.products.agregados.map((elem) => {
                    return `
                        <tr>
                          <td style="width: 30px;">${elem.id}</td>
                          <td>${elem.description}</td>
                          <td>${elem.amount}</td>
                          <td>${elem.um}</td>
                          <td>${elem.reason}</td>
                        </tr>
                        `;
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="fw-bold">TOTAL ITEMS</td>
                    <td colspan="4"></td>
                    <td className="fw-bold text-end">${
                      body.products.agregados.length
                    }</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style="position: relative; border: 1px solid black; margin-top: 1rem;">
              <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Observaciones</h3>
              <p style="margin: 0; padding: 1rem;">
              ${body.observations}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    const transporter = await mailService.sendEmails();
    mailService.generatePDF(html, (error, pdfBuffer) => {
      if (error) {
        console.log(error)
        return res.status(400).json({
          status: "ERROR",
          error,
        });
      }

      let attachments;

      if(body.evidence !== null){
        const base64Data = body.evidence.replace(/^data:image\/\w+;base64,/, "");

        // Detectar tipo MIME
        const mimeMatch = body.evidence.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";


        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Evidencia.png`,
            content: base64Data,
            encoding: "base64",
            contentType: mimeType,
          },
        ];
      }else{
        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          }
        ];
      }

      req.file &&
        attachments.push({
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        });

        transporter.sendMail(
        {
          from: config.smtpEmail,
          to: body.destiny,
          //to: body?.agency?.contacto?.email,
          //cc: body.seller.tercero ? body.seller.tercero.contacto.email : body.seller.mailCommercial,
          subject: "¡DEVOLUCIONES Y AVERÍAS!",
          attachments,
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <title>DEVOLUCIONES Y AVERÍAS</title>
              <style>
                body {
                  font-family: Arial, sans-serif;;
                  line-height: 1.5;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
          
                .header {
                  background-color: #f03c3c;
                  padding: 5px;
                  text-align: center;
                }
          
                .header h1 {
                  color: #fff;
                  font-size: medium;
                  margin: 0;
                }
          
                .invoice-details {
                  margin-top: 20px;
                }
          
                .invoice-details p {
                  margin: 0;
                }
          
                .logo {
                  text-align: right;
                }
          
                .logo img {
                  max-width: 200px;
                }
          
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
          
                .invoice-table th,
                .invoice-table td {
                  padding: 10px;
                  border: 1px solid #ccc;
                  text-align: center;
                }
          
                .invoice-table th {
                  background-color: #f1f1f1;
                }
          
                .warning {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .warning p {
                  margin: 0;
                }
          
                .att {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .att p {
                  margin: 0;
                }
          
                .att a {
                  text-decoration: none;
                }
          
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡DEVOLUCIONES Y AVERÍAS!</h1>
                </div>
          
                <div class="invoice-details">
                  <table width="100%">
                    <tr>
                      <td>
                        <p><strong>ID:</strong> ${body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'}</p>
                        <p><strong>Cliente:</strong> ${body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'}</p>
                        <p><strong>Sucursal:</strong> ${body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`}</p>
                        <p><strong>Fecha creación:</strong> ${new Date(body.createdAt).toLocaleString("es-CO")}</p>
                      </td>
                      <td class="logo">
                        <img
                          src="https://sucursales.granlangostino.com/wp-content/uploads/2022/12/cropped-Logo-el-gran-langostino.png"
                          alt="Logo de la empresa"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
          
                <div class="warning">
                  <b>Para visualizar la información Ingresa aquí ${config.autorizacionUrl}/${token}</b>                  
                </div>

                <div class="warning">
                  <p><strong>Por favor revisar los archivos antes de cualquier acción.</strong></p>
                </div>
          
                <div class="att">
                  <p>Cordialmente,</p>
                  <p>
                    EL GRAN LANGOSTINO S.A.S <br>
                    Línea Nacional 018000 180133 <br>
                    Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                    <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                  </p>
                </div>
          
                <div class="footer">
                  <p><u>Aviso Legal</u></p>
                  <p>
                    SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                    DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                    SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                    AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                    correo electrónico y todos los archivos adjuntos a éste contienen
                    información de carácter confidencial y/o uso privativo de EL GRAN
                    LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                    por error, por favor elimínelo y comuníquese con el remitente para
                    informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                    copia de la información ahí contenida, gracias. En caso contrario
                    podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                  </p>
                </div>
              </div>
            </body>
          </html>
          
          `,
        },
        (error, info) => {
          if (error) {
            console.log(error)
            next(error);
          } else {
            console.log(info)
            res.json({
              info,
            });
          }
        }
      );
      /* .then((info) => console.log(`Enviado correctamente! ${info.response}`))
      .catch((error) => next(error)); */
    });
  } catch (error) {
    next(error);
  }
};

const sendMailAuth = async (req, res, next) => {
  try {
    const { body } = req.body;
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          * {
          font-size: 8px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          thead {
            background-color: #d6d6d6;
            color: #000;
          }
          tbody {
            display: block;
            min-height: 100vh;
          }
          tr {
            display: table;
            width: 100%;
            table-layout: fixed;

          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
        </style>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            padding: 1rem 2rem;
          "
        >
          <h1 style="text-align: center; font-size: 13px; font-weight: bold">DEVOLUCIONES Y AVERÍAS</h1>
          <p style="text-align: center; margin: 0.3rem 0;">Nota: Este documento no corresponde a una requisición o nota crédito</p>
          <div style="position: relative; font-size: 8px; width: 100%; height: 100%;">
            <div style="margin: auto;">
              <h2 style="font-size: 8px; font-weight: bolder; margin: 0">
                EL GRAN LANGOSTINO S.A.S.
              </h2>
              <p style="margin: 0.3rem 0;"><strong>Nit: 835001216</strong></p>
              <p style="margin: 0.3rem 0;">Tel: 5584982 - 3155228124</p>
            </div>
            <div
              style="
                position: absolute;
                border: 1px solid black;
                width: 200px;
                top: 0;
                right: 0;
              "
            >
              <p style="padding: 0.2rem 0.5rem; margin: 0; white-space: nowrap;"><strong>Fecha creación: </strong>${new Date().toLocaleString(
                "es-CO"
              )}</p>
            </div>
          </div>
          <hr style="width: 100%; border: 1.5px solid black;"/>
          <div style="width: 100%; font-size: 13px; margin-top: 10px;">
            <div style="position: relative; margin-bottom: 2rem;">
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; padding: 1rem;">
                <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Solicitante</h3>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nit: </strong>${
                    body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nombre: </strong>${
                    body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Sucursal: </strong>${
                    body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Fecha creación: </strong>${
                    new Date(body.createdAt).toLocaleString("es-CO")
                  }</p>
                </div>
              </div>
            </div>
            <div style="width: 100%; border: 1px solid black;">
              <table style="width: 100%; height: 100%;">
                <thead>
                  <tr>
                    <th style="width: 30px;">Ref.</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>UM</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  ${body.products.agregados.map((elem) => {
                    return `
                        <tr>
                          <td style="width: 30px;">${elem.id}</td>
                          <td>${elem.description}</td>
                          <td>${elem.amount}</td>
                          <td>${elem.um}</td>
                          <td>${elem.reason}</td>
                        </tr>
                        `;
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="fw-bold">TOTAL ITEMS</td>
                    <td colspan="4"></td>
                    <td className="fw-bold text-end">${
                      body.products.agregados.length
                    }</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style="position: relative; border: 1px solid black; margin-top: 1rem;">
              <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Observaciones</h3>
              <p style="margin: 0; padding: 1rem;">
              ${body.observations}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    const transporter = await mailService.sendEmails();
    mailService.generatePDF(html, (error, pdfBuffer) => {
      if (error) {
        console.log(error)
        return res.status(400).json({
          status: "ERROR",
          error,
        });
      }

      let attachments;

      if(body.evidence !== null){
        const base64Data = body.evidence.replace(/^data:image\/\w+;base64,/, "");

        // Detectar tipo MIME
        const mimeMatch = body.evidence.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";


        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Evidencia.png`,
            content: base64Data,
            encoding: "base64",
            contentType: mimeType,
          },
        ];
      }else{
        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          }
        ];
      }

      req.file &&
        attachments.push({
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        });

        transporter.sendMail(
        {
          from: config.smtpEmail,
          to: body.destiny,
          //to: body?.agency?.contacto?.email,
          //cc: body.seller.tercero ? body.seller.tercero.contacto.email : body.seller.mailCommercial,
          subject: "¡DEVOLUCIONES Y AVERÍAS!",
          attachments,
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <title>DEVOLUCIONES Y AVERÍAS</title>
              <style>
                body {
                  font-family: Arial, sans-serif;;
                  line-height: 1.5;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
          
                .header {
                  background-color: #f03c3c;
                  padding: 5px;
                  text-align: center;
                }
          
                .header h1 {
                  color: #fff;
                  font-size: medium;
                  margin: 0;
                }
          
                .invoice-details {
                  margin-top: 20px;
                }
          
                .invoice-details p {
                  margin: 0;
                }
          
                .logo {
                  text-align: right;
                }
          
                .logo img {
                  max-width: 200px;
                }
          
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
          
                .invoice-table th,
                .invoice-table td {
                  padding: 10px;
                  border: 1px solid #ccc;
                  text-align: center;
                }
          
                .invoice-table th {
                  background-color: #f1f1f1;
                }
          
                .warning {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .warning p {
                  margin: 0;
                }
          
                .att {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .att p {
                  margin: 0;
                }
          
                .att a {
                  text-decoration: none;
                }
          
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡DEVOLUCIONES Y AVERÍAS!</h1>
                </div>
          
                <div class="invoice-details">
                  <table width="100%">
                    <tr>
                      <td>
                        <p><strong>ID:</strong> ${body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'}</p>
                        <p><strong>Cliente:</strong> ${body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'}</p>
                        <p><strong>Sucursal:</strong> ${body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`}</p>
                        <p><strong>Fecha creación:</strong> ${new Date(body.createdAt).toLocaleString("es-CO")}</p>
                      </td>
                      <td class="logo">
                        <img
                          src="https://sucursales.granlangostino.com/wp-content/uploads/2022/12/cropped-Logo-el-gran-langostino.png"
                          alt="Logo de la empresa"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
          
                <div class="warning">
                  <b>Para visualizar la información Ingresa aquí ${config.autorizacionUrl}/${token}</b>                  
                </div>

                <div class="warning">
                  <p><strong>Por favor revisar los archivos antes de cualquier acción.</strong></p>
                </div>
          
                <div class="att">
                  <p>Cordialmente,</p>
                  <p>
                    EL GRAN LANGOSTINO S.A.S <br>
                    Línea Nacional 018000 180133 <br>
                    Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                    <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                  </p>
                </div>
          
                <div class="footer">
                  <p><u>Aviso Legal</u></p>
                  <p>
                    SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                    DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                    SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                    AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                    correo electrónico y todos los archivos adjuntos a éste contienen
                    información de carácter confidencial y/o uso privativo de EL GRAN
                    LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                    por error, por favor elimínelo y comuníquese con el remitente para
                    informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                    copia de la información ahí contenida, gracias. En caso contrario
                    podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                  </p>
                </div>
              </div>
            </body>
          </html>
          
          `,
        },
        (error, info) => {
          if (error) {
            console.log(error)
            next(error);
          } else {
            console.log(info)
            res.json({
              info,
            });
          }
        }
      );
      /* .then((info) => console.log(`Enviado correctamente! ${info.response}`))
      .catch((error) => next(error)); */
    });
  } catch (error) {
    next(error);
  }
};

const sendMailEnd = async (req, res, next) => {
  try {
    const { body } = req.body;
    const { id } = req.idToken;

    console.log(body)

    const payload = {
      id: id
    }

    console.log(payload)

    const token = jwt.sign(payload, config.jwtSecret,{ expiresIn: "24h" })

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          * {
          font-size: 8px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          thead {
            background-color: #d6d6d6;
            color: #000;
          }
          tbody {
            display: block;
            min-height: 100vh;
          }
          tr {
            display: table;
            width: 100%;
            table-layout: fixed;

          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
        </style>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            padding: 1rem 2rem;
          "
        >
          <h1 style="text-align: center; font-size: 13px; font-weight: bold">DEVOLUCIONES Y AVERÍAS</h1>
          <p style="text-align: center; margin: 0.3rem 0;">Nota: Este documento no corresponde a una requisición o nota crédito</p>
          <div style="position: relative; font-size: 8px; width: 100%; height: 100%;">
            <div style="margin: auto;">
              <h2 style="font-size: 8px; font-weight: bolder; margin: 0">
                EL GRAN LANGOSTINO S.A.S.
              </h2>
              <p style="margin: 0.3rem 0;"><strong>Nit: 835001216</strong></p>
              <p style="margin: 0.3rem 0;">Tel: 5584982 - 3155228124</p>
            </div>
            <div
              style="
                position: absolute;
                border: 1px solid black;
                width: 200px;
                top: 0;
                right: 0;
              "
            >
              <p style="padding: 0.2rem 0.5rem; margin: 0; white-space: nowrap;"><strong>Fecha creación: </strong>${new Date().toLocaleString(
                "es-CO"
              )}</p>
            </div>
          </div>
          <hr style="width: 100%; border: 1.5px solid black;"/>
          <div style="width: 100%; font-size: 13px; margin-top: 10px;">
            <div style="position: relative; margin-bottom: 2rem;">
              <div style="position: relative; border: 1px solid black; border-radius: 5px; width: 99%; padding: 1rem;">
                <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Solicitante</h3>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nit: </strong>${
                    body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Nombre: </strong>${
                    body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Sucursal: </strong>${
                    body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`
                  }</p>
                </div>
                <div>
                  <p style="margin: 0; width: 100%;"><strong style="margin-right: 0.5rem;">Fecha creación: </strong>${
                    new Date(body.createdAt).toLocaleString("es-CO")
                  }</p>
                </div>
              </div>
            </div>
            <div style="width: 100%; border: 1px solid black;">
              <table style="width: 100%; height: 100%;">
                <thead>
                  <tr>
                    <th style="width: 30px;">Ref.</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>UM</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  ${body.products.agregados.map((elem) => {
                    return `
                        <tr>
                          <td style="width: 30px;">${elem.id}</td>
                          <td>${elem.description}</td>
                          <td>${elem.amount}</td>
                          <td>${elem.um}</td>
                          <td>${elem.reason}</td>
                        </tr>
                        `;
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="fw-bold">TOTAL ITEMS</td>
                    <td colspan="4"></td>
                    <td className="fw-bold text-end">${
                      body.products.agregados.length
                    }</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style="position: relative; border: 1px solid black; margin-top: 1rem;">
              <h3 style="background: #fff; font-size: 8px; position: absolute; top: -8px; left: 25px; margin: 0; padding: 0px 10px;">Observaciones</h3>
              <p style="margin: 0; padding: 1rem;">
              ${body.observations}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    const transporter = await mailService.sendEmails();
    mailService.generatePDF(html, (error, pdfBuffer) => {
      if (error) {
        console.log(error)
        return res.status(400).json({
          status: "ERROR",
          error,
        });
      }

      let attachments;

      if(body.evidence !== null){
        const base64Data = body.evidence.replace(/^data:image\/\w+;base64,/, "");

        // Detectar tipo MIME
        const mimeMatch = body.evidence.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";


        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Evidencia.png`,
            content: base64Data,
            encoding: "base64",
            contentType: mimeType,
          },
        ];
      }else{
        attachments = [
          {
            filename: `${(body?.agency !== null) ? body?.agency.id : parseInt(body.client.nit) }-Devoluciones y averías.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          }
        ];
      }

      req.file &&
        attachments.push({
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        });

        transporter.sendMail(
        {
          from: config.smtpEmail,
          to: body.destiny,
          //to: body?.agency?.contacto?.email,
          //cc: body.seller.tercero ? body.seller.tercero.contacto.email : body.seller.mailCommercial,
          subject: "¡DEVOLUCIONES Y AVERÍAS!",
          attachments,
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
                rel="stylesheet"
              />
              <title>DEVOLUCIONES Y AVERÍAS</title>
              <style>
                body {
                  font-family: Arial, sans-serif;;
                  line-height: 1.5;
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
          
                .header {
                  background-color: #f03c3c;
                  padding: 5px;
                  text-align: center;
                }
          
                .header h1 {
                  color: #fff;
                  font-size: medium;
                  margin: 0;
                }
          
                .invoice-details {
                  margin-top: 20px;
                }
          
                .invoice-details p {
                  margin: 0;
                }
          
                .logo {
                  text-align: right;
                }
          
                .logo img {
                  max-width: 200px;
                }
          
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
          
                .invoice-table th,
                .invoice-table td {
                  padding: 10px;
                  border: 1px solid #ccc;
                  text-align: center;
                }
          
                .invoice-table th {
                  background-color: #f1f1f1;
                }
          
                .warning {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .warning p {
                  margin: 0;
                }
          
                .att {
                  text-align: center;
                  margin-top: 20px;
                }
          
                .att p {
                  margin: 0;
                }
          
                .att a {
                  text-decoration: none;
                }
          
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>¡DEVOLUCIONES Y AVERÍAS!</h1>
                </div>
          
                <div class="invoice-details">
                  <table width="100%">
                    <tr>
                      <td>
                        <p><strong>ID:</strong> ${body.client !== null ? parseInt(body.client.nit) : '835.001.216-8'}</p>
                        <p><strong>Cliente:</strong> ${body.client !== null ? body.client.razonSocial : 'El Gran Langostino S.A.S'}</p>
                        <p><strong>Sucursal:</strong> ${body.branch !== null ? body.branch.descripcion : `${body.agency.id} - ${body.agency.descripcion}`}</p>
                        <p><strong>Fecha creación:</strong> ${new Date(body.createdAt).toLocaleString("es-CO")}</p>
                      </td>
                      <td class="logo">
                        <img
                          src="https://sucursales.granlangostino.com/wp-content/uploads/2022/12/cropped-Logo-el-gran-langostino.png"
                          alt="Logo de la empresa"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
          
                <div class="warning">
                  <b>Para visualizar la información Ingresa aquí ${config.autorizacionUrl}/${token}</b>                  
                </div>

                <div class="warning">
                  <p><strong>Por favor revisar los archivos antes de cualquier acción.</strong></p>
                </div>
          
                <div class="att">
                  <p>Cordialmente,</p>
                  <p>
                    EL GRAN LANGOSTINO S.A.S <br>
                    Línea Nacional 018000 180133 <br>
                    Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                    <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                  </p>
                </div>
          
                <div class="footer">
                  <p><u>Aviso Legal</u></p>
                  <p>
                    SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                    DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                    SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                    AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                    correo electrónico y todos los archivos adjuntos a éste contienen
                    información de carácter confidencial y/o uso privativo de EL GRAN
                    LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                    por error, por favor elimínelo y comuníquese con el remitente para
                    informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                    copia de la información ahí contenida, gracias. En caso contrario
                    podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                  </p>
                </div>
              </div>
            </body>
          </html>
          
          `,
        },
        (error, info) => {
          if (error) {
            console.log(error)
            next(error);
          } else {
            console.log(info)
            res.json({
              info,
            });
          }
        }
      );
      /* .then((info) => console.log(`Enviado correctamente! ${info.response}`))
      .catch((error) => next(error)); */
    });
  } catch (error) {
    next(error);
  }
};

const sendMailNotCondition = async (req, res, next) => {
  try {
    const { body } = req;

    const transporter = await nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: true,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword
      }
    });
    transporter.sendMail(
      {
        from: config.smtpEmail,
        //to: 'sistemas2@granlangostino.net',
        to: 'mant.vehiculos@granlangostino.net, admonfinanciera@granlangostino.com, saludocupacional@granlangostino.com',
        cc: 'administrador@granlangostino.com',
        subject: "¡LIMITACIÓN DE CONDUCTOR!",
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;900&display=swap"
              rel="stylesheet"
            />
            <title>NOTIFICACIÓN ESTADO DE SALUD</title>
            <style>
              body {
                font-family: Arial, sans-serif;;
                line-height: 1.5;
                color: #333;
                margin: 0;
                padding: 0;
              }
        
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
              }
        
              .header {
                background-color: #007bff;
                padding: 5px;
                text-align: center;
              }
        
              .header h1 {
                color: #fff;
                font-size: medium;
                margin: 0;
              }
        
              .invoice-details {
                margin-top: 20px;
              }
        
              .invoice-details p {
                margin: 0;
              }
        
              .logo {
                text-align: right;
              }
        
              .logo img {
                max-width: 200px;
              }
        
              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
        
              .invoice-table th,
              .invoice-table td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: center;
              }
        
              .invoice-table th {
                background-color: #f1f1f1;
              }
        
              .warning {
                text-align: center;
                margin-top: 20px;
              }
        
              .warning p {
                margin: 0;
              }
        
              .att {
                text-align: center;
                margin-top: 20px;
              }
        
              .att p {
                margin: 0;
              }
        
              .att a {
                text-decoration: none;
              }
        
              .footer {
                margin-top: 20px;
                text-align: center;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡REPORTE DE ESTADO DE SALUD!</h1>
              </div>
        
              <div class="invoice-details">
                <table width="100%">
                  <tr>
                    <td>
                      <p><strong>Un conductor ha reportado tener limitaciones de salud para desempeñar su función. A continuación encontrará la información correspondiente.</strong></p>
                        <br/>
                      <p><strong>ID:</strong> ${body.rowId !== null && body.rowId}</p>
                      <p><strong>Nombre:</strong> ${body.driver !== null && body.driver}</p>
                      <p><strong>Agencia:</strong> ${body.co !== null && body?.co}</p>
                      <p><strong>Resumen de la limitación:</strong> ${body.diagnosis !== null && body?.diagnosis}</p>
                      <p><strong>Fecha creación:</strong> ${new Date(body.createdAt).toLocaleString("es-CO")}</p>
                    </td>
                    <td class="logo">
                      <img
                        src="https://sucursales.granlangostino.com/wp-content/uploads/2022/12/cropped-Logo-el-gran-langostino.png"
                        alt="Logo de la empresa"
                      />
                    </td>
                  </tr>
                </table>
              </div>
        
              <div class="warning">
                <b>Para visualizar la información Ingresa aquí: ${config.consultPreOpe}/${body.id}</b>                  
              </div>
        
              <div class="att">
                <p>Cordialmente,</p>
                <p>
                  EL GRAN LANGOSTINO S.A.S <br>
                  Línea Nacional 018000 180133 <br>
                  Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                  <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                </p>
              </div>
        
              <div class="footer">
                <p><u>Aviso Legal</u></p>
                <p>
                  SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                  DATOS COMO CORREO/CONTACTO CORPORATIVO (DATO PÚBLICO), POR LO TANTO,
                  SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                  AGRADECEMOS NOS INFORME AL RESPECTO. El contenido de este mensaje de
                  correo electrónico y todos los archivos adjuntos a éste contienen
                  información de carácter confidencial y/o uso privativo de EL GRAN
                  LANGOSTINO S.A.S y de sus destinatarios. Si usted recibió este mensaje
                  por error, por favor elimínelo y comuníquese con el remitente para
                  informarle de este hecho, absteniéndose de divulgar o hacer cualquier
                  copia de la información ahí contenida, gracias. En caso contrario
                  podrá ser objeto de sanciones legales conforme a la ley 1273 de 2009.
                </p>
              </div>
            </div>
          </body>
        </html>
        
        `,
      },
      (error, info) => {
        if (error) {
          console.log(error)
          next(error);
        } else {
          console.log(info)
          res.json({
            info,
          });
        }
      }
    );

  } catch (error) {
    console.log(error)
    next(error);
  }
};

const sendMailNews = async (req, res, next) => {
  try {
    // Extraemos la información del req.body
    const { novedades = {}, infoDriver = {} } = req.body;

    // Validamos si novedades es un arreglo o un objeto para recorrerlo correctamente
    const listaNovedades = Array.isArray(novedades) 
      ? novedades 
      : Object.values(novedades);

    const novedadesHTML = listaNovedades
      .map((item) => {
        // Tomamos la etiqueta/nombre (label, id o concepto)
        const label = item.label || item.id || item.campo || "Concepto sin nombre";
        // Tomamos la respuesta/valor (valor, value o estado)
        const valor = item.valor || item.value || item.estado || "N/A";

        return `
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc; text-align: left; font-weight: bold;">
              ${label}
            </td>
            <td style="padding: 8px; border: 1px solid #ccc; text-align: center; color: #d9534f; font-weight: bold;">
              ${valor}
            </td>
          </tr>
        `;
      })
      .join('');

    const transporter = await nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: true,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword
      }
    });

    transporter.sendMail(
      {
        from: config.smtpEmail,
        //to: 'sistemas2@granlangostino.net',
        to: 'mant.vehiculos@granlangostino.net, admonfinanciera@granlangostino.com, saludocupacional@granlangostino.com',
        cc: 'administrador@granlangostino.com',
        subject: "¡NOTIFICACIÓN DE NOVEDADES!",
        html: `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>NOTIFICACIÓN EN REPORTE DIARIO</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                margin: 0;
                padding: 0;
              }
        
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
              }
        
              .header {
                background-color: #007bff;
                padding: 10px;
                text-align: center;
              }
        
              .header h1 {
                color: #fff;
                font-size: 18px;
                margin: 0;
              }
        
              .driver-details {
                margin-top: 20px;
              }
        
              .driver-details p {
                margin: 4px 0;
              }
        
              .logo {
                text-align: center;
                margin-top: 15px;
              }
        
              .logo img {
                max-width: 180px;
              }
        
              .novedades-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
              }
        
              .novedades-table th {
                background-color: #007bff;
                color: white;
                padding: 8px;
                text-align: left;
                border: 1px solid #ccc;
              }
        
              .warning {
                text-align: center;
                margin-top: 20px;
                background-color: #fff3cd;
                padding: 10px;
                border-radius: 4px;
              }
        
              .att, .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡NOVEDADES EN REPORTE PREOPERACIONAL!</h1>
              </div>
        
              <div class="driver-details">
                <p><strong>Un conductor ha reportado novedades en la inspección. A continuación encontrará la información correspondiente:</strong></p>
                <br/>
                <p><strong>ID:</strong> ${infoDriver.rowId || 'N/A'}</p>
                <p><strong>Nombre:</strong> ${infoDriver.driver || 'N/A'}</p>
                <p><strong>Agencia / Centro de Operaciones:</strong> ${infoDriver.co || 'N/A'}</p>
                <p><strong>Fecha de reporte:</strong> ${new Date().toLocaleString("es-CO")}</p>
              </div>

              <!-- Tabla estructurada con las novedades -->
              <h3 style="margin-top: 20px; color: #007bff;">Detalle de Novedades</h3>
              <table class="novedades-table">
                <thead>
                  <tr>
                    <th>Ítem / Concepto</th>
                    <th>Estado / Respuesta</th>
                  </tr>
                </thead>
                <tbody>
                  ${novedadesHTML || '<tr><td colspan="2" style="padding: 8px; text-align: center;">No se registraron detalles.</td></tr>'}
                </tbody>
              </table>

              <div class="logo">
                <img
                  src="https://sucursales.granlangostino.com/wp-content/uploads/2022/12/cropped-Logo-el-gran-langostino.png"
                  alt="Logo Gran Langostino"
                />
              </div>
        
              <div class="warning">
                <b>Para visualizar la información completa ingresa aquí: ${config.consultPreOpe}/${infoDriver.id} </b>
              </div>
        
              <div class="att">
                <p>Cordialmente,</p>
                <p>
                  <strong>EL GRAN LANGOSTINO S.A.S</strong><br>
                  Línea Nacional 018000 180133 <br>
                  Calle 13 #32-417 Bodega 4 Acopi - Yumbo, Valle <br> 
                  <a href="https://tienda.granlangostino.com/">www.granlangostino.com</a>
                </p>
              </div>
        
              <div class="footer">
                <p><u>Aviso Legal</u></p>
                <p>
                  El contenido de este mensaje de correo electrónico contiene información de carácter confidencial de EL GRAN LANGOSTINO S.A.S. Si usted recibió este mensaje por error, por favor elimínelo.
                </p>
              </div>
            </div>
          </body>
        </html>
        `,
      },
      (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
          return next(error);
        }
        console.log("Correo enviado:", info);
        return res.json({ info });
      }
    );

  } catch (error) {
    console.error("Error en el servidor:", error);
    next(error);
  }
};

module.exports = {
  sendMail,
  sendMailAuth,
  sendMailEnd,
  sendMailNotCondition,
  sendMailNews,
};
