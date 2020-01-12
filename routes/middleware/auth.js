const jwt = require('jsonwebtoken');
const User =  require('../../models/User');

const auth = async (req,res,next) => {
    try {
        const token  =  req.header('Authorization').replace('Bearer ','');
        const payload = jwt.verify(token,'somesecretsecret' ); 
        const usr  = await User.findOne({_id: payload._id,  'tokens.token' : token});
        req.user = usr;

    } catch (error) {
        res.status(401).send({ error : 'Authentication failed.'})
    }

    next();
}

module.exports = auth; 