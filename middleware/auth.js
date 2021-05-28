// Dependencies
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    const token = req.header('auth-token');
    // check if token is not empty
    if(!token){
        return res.status(400).json({ errors: [ { 'msg' : 'No token Authorization denied' }]});
    }
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }
    catch(err){
        console.error(err.message);
        return res.status(401).json({ errors: [ { 'msg' : 'Invalid Token' }]});
    }
}