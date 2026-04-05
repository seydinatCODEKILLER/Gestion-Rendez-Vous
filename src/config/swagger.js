import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Gestion des Rendez-vous",
    version: "1.0.0",
    description: `
API REST pour la gestion des patients, médecins, rendez-vous et ordonnances.
Architecture Express procédurale avec Prisma.
    `,
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Serveur local",
    },
    {
      url: "https://gestion-rendez-vous-mvkz.onrender.com/api",
      description: "Serveur en production",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
