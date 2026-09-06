import jwt from 'jsonwebtoken'

const genToken = (userId)=>{
    return jwt.sign({userId}, process.env.jwt_secret, {expiresIn : '14d'})
}

export default genToken