var express = require('express');
var router = express.Router();
var cipherController = require('../../controllers/CipherController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/', auth, cipherController.createCipher);
router.post('/code', auth, cipherController.updateCipherCode);
router.get('/', auth, cipherController.getCiphers);
router.delete('/', auth, cipherController.deleteCipher);
router.put('/', auth, cipherController.updateCipher);
router.get('/search/:cipher_code', auth, cipherController.searchCipher);





module.exports = router;
