/** @param {import('fastify').FastifyInstance} fastify */
async function authRoutes(fastify) {
  const { db } = fastify.mongo;

  fastify.post("/register", async (req) => {
    const { username, password } = req.body;
    const newUser = {
      todoLists: {},
      username,
      password,
    };

    await db.collection("users").insertOne(newUser);
    return { user: newUser };
  });

  fastify.post("/login", async (req) => {
    const { username, password } = req.body;
    const user = await db.collection("users").findOne({ username, password });

    if (!user) throw new Error("Wrong Credential");

    const token = fastify.jwt.sign({ _id: user._id, username });
    return { token };
  });

  /**
   * @desc takes token and returns username/userKey
   */
  fastify.get("/me", { preValidation: [fastify.authenticate] }, async (req) => {
    return req.user;
  });
}

export { authRoutes };
