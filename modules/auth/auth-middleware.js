import fastifyPlugin from "fastify-plugin";
import jwt from "fastify-jwt";

const _authPlugin = fastifyPlugin(async (fastify) => {
  fastify.register(jwt, { secret: process.env.JWT_TOKEN });

  fastify.decorate("authenticate", async (req) => {
    return req.jwtVerify();
  });
});

export default _authPlugin;
