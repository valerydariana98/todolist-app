require("dotenv").config();

const connectDB = require("./config/db");

const app = require("./app");

const PORT = process.env.PORT || 3000;

const startServer = async () => {

   try {

      await connectDB();

      app.listen(PORT, () => {
         console.log(`Servidor corriendo en puerto ${PORT}`);
      });

   } catch (error) {

      console.error("Error iniciando servidor:", error);

   }

};

startServer();