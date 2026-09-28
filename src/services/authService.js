const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const MailService = require('./mailService')
const UserService = require('./userService')
const { config } = require('../config/config')

const getUser = async (email, password) => {
  const user = await UserService.findByUsername(email)

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) throw boom.unauthorized()

  delete user.dataValues.password
  return user
}

const signToken = (user) => {
  const payload = {
    sub: user.id,
    role: user.role
  }
  const token = jwt.sign(payload, config.jwtSecret)
  return {
    user, token
  }
}

const changePassword = async (id, currentPassword, newPassword) => {
  const user = await UserService.findOne(id)

  const isMatch = bcrypt.compareSync(currentPassword, user.password)

  if(!isMatch) throw boom.unauthorized()

  const hash = bcrypt.hashSync(newPassword, 10)

  const updatedUser = await user.update({ password: hash })
  delete updatedUser.dataValues.password
  return updatedUser
}

const sendRecovery = async (email) => {
  const user = await UserService.findByEmail(email)

  if (!user) throw boom.unauthorized()

  const payload = { sub: user.id }
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15min'
  })
  const mail = {
    from: config.smtpEmail,
    to: user.email,
    subject: 'Recuperación de contraseña',
    html:`
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
          <title>RECUPERACION DE CONTRASEÑA</title>
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
              <h1>¡TOKEN DE RECUPERACION DE CONTRASEÑA GENERADO!</h1>
            </div>

            <div class="invoice-details">
              <table width="100%">
                <tr>
                  <td>
                    <p><strong>INTRUCCIONES PARA CAMBIO DE CONTRASEÑA:</strong></p>
                    <br/>
                    <p><strong>1. Ingresa al siguiente enlace dando click sobre el.</strong></p>
                    <p><strong>2. Digita la nueva contraseña en la primer casilla.</strong></p>
                    <p><strong>3. Digita nuevamente la nueva contraseña en la segunda casilla.</strong></p>
                    <p><strong>4. Da click en 'Reestablecer' para llevar a cabo el proceso.</strong></p>
                    <br/>
                    <p>Recuerda que solo cuentas con 15 minutos para llevar a cabo este proceso, si sobre pasas</p>
                    <p>este tiempo deberás solicitar de nuevo el token de recuperación en nuestro aplicativo.</p>
                    <br/>
                    <p>Link de recuperación: ${config.recoveryUrl}/${token}</p>
                  </td>
                </tr>
              </table>
            </div>
            <div class="footer">
              <p><u>Aviso Legal</u></p>
              <p>
                SU CORREO LO TENEMOS REGISTRADO DENTRO DE NUESTRA BASE DE
                DATOS COMO CORREO/CONTACTO (DATO PÚBLICO), POR LO TANTO,
                SI NO DESEA SEGUIR RECIBIENDO INFORMACIÓN DE NUESTRA EMPRESA, LE
                AGRADECEMOS NOS INFORME AL RESPECTO.</p>
               <p> El contenido de este mensaje de
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
    }

  const rta = await MailService.sendEmails(mail)
  await UserService.update(user.id, { recoveryToken: token })
  return rta
}

const changeRecoveryPassword = async (token, newPassword) => {
  try {
    console.log(token)
    const payload = jwt.verify(token, config.jwtSecret)
    const user = await UserService.findOne(payload.sub)

    if (user.recoveryToken !== token) throw boom.unauthorized()

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await UserService.update(user.id, {
      password: hashedPassword,
      recoveryToken: null
    })
    return { message: 'Password changed' }
  } catch (error) {
    throw boom.unauthorized()
  }
}

/* const sendMail = async (infoMail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword
    }
  })
  await transporter.sendMail(infoMail)
  return { message: 'Mail sent' }
} */

module.exports = {
  getUser,
  signToken,
  changePassword,
  sendRecovery,
  changeRecoveryPassword,
  //sendMail
}