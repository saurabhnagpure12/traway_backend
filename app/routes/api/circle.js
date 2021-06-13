var express = require('express');
var router = express.Router();
var circleController = require('../../controllers/CircleController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/', auth, circleController.createCircle);
router.get('/', auth, circleController.getCircleInfo);
router.delete('/', auth, circleController.deleteCircle);
router.put('/name', auth, circleController.editCircleName);
router.post('/member', auth, circleController.joinCircle);
router.delete('/member', auth, circleController.removeMember);


module.exports = router;
