const validate = (schema) => (req, res, next) => {
   try {
      schema.parse(req.body);
      next();

   } catch (error) {

      return res.status(400).json({
         error: {
            message: "Validation failed",
            details: error.errors,
            status: 400
         }

      });
   }
};

module.exports = validate;