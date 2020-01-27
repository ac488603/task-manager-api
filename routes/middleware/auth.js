const jwt = require('jsonwebtoken');
const User =  require('../../models/User');

const auth = async (req,res,next) => {
    try {
        const token  =  req.header('Authorization').replace('Bearer ','');
        const payload = jwt.verify(token, process.env.JWT_SECRET); 
        const usr  = await User.findOne({_id: payload._id,  'tokens.token' : token});

        if(!usr){
            throw new Error();
        }
        req.user = usr;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error : 'Authentication failed.'})
    }
}

module.exports = auth; 