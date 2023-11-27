// karena menggunakan .env variable, jd lakuin import ini di awal aplikasi jalan
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const errorHandler = require("../middlewares/errorHandler");

const router = require("../routes");

const swaggerDocument = require("../doc/swagger.json");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server jalan di port : ${PORT}`);
});
