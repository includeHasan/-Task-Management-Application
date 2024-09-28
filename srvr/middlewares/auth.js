const jwt=require('jsonwebtoken');


const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
  
const isAdmin=async(req,res,next)=>{
   if(req.user.isAdmin===false){
       return res.status(403).json({message:'Not authorized, not admin'});
    next();
}
}
module.exports={protect,isAdmin};