const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KVS Krepsinio Analize API",
      version: "1.0.0",
      description: "API documentation for KVS Krepsinio Analize",
    },
    servers: [
      {
        url: "http://yamabiko.proxy.rlwy.net:34700",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);
module.exports = specs;
