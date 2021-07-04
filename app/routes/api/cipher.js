var express = require('express');
var router = express.Router();
var cipherController = require('../../controllers/CipherController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/', auth, cipherController.createCipher);
router.get('/', auth, cipherController.getCiphers);
router.delete('/', auth, cipherController.deleteCipher);
router.put('/', auth, cipherController.updateCipher);




module.exports = router;
