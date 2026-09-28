const express = require("express");
const multer = require("multer");
const MailController = require("../../controllers/mailController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/send", MailController.sendMail)
router.post("/not/condition", MailController.sendMailNotCondition)
router.post("/news", MailController.sendMailNews);

module.exports = router;
