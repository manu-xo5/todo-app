import { fastify } from "fastify";
import { todoListRoutes } from "./modules/todo/routes.js";
import { authRoutes } from "./modules/auth/routes.js";
import authPlugin from "./modules/auth/auth-middleware.js";
import mongodb from "fastify-mongodb";

const app = fastify({ logger: true });

app
  .register(mongodb, {
    url: "mongodb://localhost:27017/todo-app",
    database: "todo-app",
    forceClose: true,
  })
  .register(authPlugin)
  .register(todoListRoutes)
  .register(authRoutes);

app.listen(5000, (err) => {
  if (err) {
    console.error("Failed: fastify.listen()");
    console.error(err);
    process.exit(1);
  }
  app.log.info("Started: fastify listening on 5000");
});
