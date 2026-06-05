require("dotenv").config();

const fs = require("fs");
const path = require("path");
const https = require("https");

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
   try {
      await connectDB();
      if (process.env.NODE_ENV === "production") {
         app.listen(PORT, () => {
            console.log(
               `Servidor corriendo en puerto ${PORT}`
            );
         });
      } else {
         const options = {
            key: fs.readFileSync(
               path.join(__dirname, "../certs/key.pem")
            ),
            cert: fs.readFileSync(
               path.join(__dirname, "../certs/cert.pem")
            )
         };
         https.createServer(
            options,
            app
         ).listen(PORT, () => {
            console.log(
               `Servidor HTTPS corriendo en puerto ${PORT}`
            );
         });
      }
   } catch (error) {
      console.error(
         "Error iniciando servidor:",
         error
      );
   }
};

startServer();