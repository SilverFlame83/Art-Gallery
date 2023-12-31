const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { TOKEN_SECRET, COOKIE_NAME } = require('../config')
const userService = require('../services/user')

module.exports = () => (req, res, next) => {
    if(parseToken(req,res)){
        req.auth = {
            async register(username,address, password) {
                const token = await register(username,address, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login(username, password) {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };
    
        next();
    }
};


async function register(username,address, password) {
   
    const existUsername = await userService.getUserByUsername(username);

    if (existUsername) {
      throw new Error("Username is taken!");
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(username,address, hashedPassword);

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);

    if (!user) {
        const err = new Error("No such user!");
        err.type = 'credential'
        throw err;
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorect password');
    }
    return generateToken(user);
}


function generateToken(userData) {
    return jwt.sign({
        _id: userData.id,
        username: userData.username,
        address: userData.address
    }, TOKEN_SECRET);
}

function parseToken(req, res){
    const token  = req.cookies[COOKIE_NAME];
    if(token){
        try{
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;
        }catch(err){
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
    
            return false;
        }
    }
    return true;
}