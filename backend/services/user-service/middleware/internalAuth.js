
export default (req, res, next) => {
   
  const key = req.headers["x-internal-key"];

  if (key !== process.env.INTERNAL_SECRET_KEY) {
    // console.error("Forbidden: Invalid internal key"); 
    return res.status(403).json({ message: "Forbidden: Invalid internal key" });
  }
  next();
};

