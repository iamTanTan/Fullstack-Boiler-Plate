import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { COOKIE_NAME, __prod__ } from "./constants";
import { createConnection } from "typeorm";
import path from "path";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/user";
import { buildSchema } from "type-graphql";

// global vars
const RedisStore = connectRedis(session);
const redis = new Redis();

// main function
const main = async () => {
    // initialize type-orm connection
    const conn = await createConnection({
        type: "postgres",
        database: "database",
        username: "postgres",
        password: "Tanman11!!",
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [User],
    });

    console.log(conn.options);

    // create app
    const app = express();

    // CORS
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));

    // session middleware
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                // 3 days
                maxAge: 1000 * 60 * 60 * 72,
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__,
            },
            saveUninitialized: false,
            secret: "thisisasupersecretkeyiosadf80da0dhwoefgaf",
            resave: false,
        })
    );

    // use express with graphql and apollo server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({ resolvers: [UserResolver] }),
    });
    await apolloServer.start();
    // apply apollo middleware to express to create graphql endpoint on server
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000" },
    });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
};

// async function startApolloServer(typeDefs, resolvers) {
//     const app = express();
//     const httpServer = http.createServer(app);
//     const server = new ApolloServer({
//         typeDefs,
//         resolvers,
//         csrfPrevention: true,
//         plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//     });
//     await server.start();
//     server.applyMiddleware({ app, cors: { origin: "http://localhost:3000" } });
//     await new Promise<void>((resolve) =>
//         httpServer.listen({ port: 4000 }, resolve)
//     );
//     console.log(
//         `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
//     );
// }

//run main
main().catch((err) => {
    console.error(err);
});
