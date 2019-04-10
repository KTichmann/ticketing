const jwt = require('jsonwebtoken');
const { SECRET } = process.env;

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')){
        //remove bearer from string
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, SECRET, (err, decoded) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Invalid Token'
                });
            } else {
                req.decoded = decoded.username;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        })
    }
}

module.exports = {
    checkToken: checkToken
}