require('dotenv').config()

const config = {
    port: process.env.PORT,
    host: process.env.HOST,
    dbUrl: process.env.DB_URL,
    recoveryUrl: process.env.RECOVERY_URL,
    isProd: false,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPassword: process.env.SMTP_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    autorizacionUrl: process.env.AUTORIZACION_URL,
    consultPreOpe: process.env.CONSULT_PRE_OPE,
    ituranUser: process.env.ITURAN_USER,
    ituranPassword: process.env.ITURAN_PASSWORD,
    ituranCompany: process.env.ITURAN_COMPANY,
    ituranUrl: process.env.ITURAN_URL,
}

module.exports = { config }