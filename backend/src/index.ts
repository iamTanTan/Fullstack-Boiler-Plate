import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "graphql";
import { COOKIE_NAME, __prod__ } from "./constants";

// global vars
const RedisStore = connectRedis(session);
const redis = new Redis();

// main function
const main = async () => {
    // initialize type-orm connection

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
        // schema: await buildSchema({
        //     resolvers: [],
        //     validate: false,
        // }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
        }),
    });

    // apply apollo middleware to express to create graphql endpoint on server
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000" },
    });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
};

//run main
main().catch((err) => {
    console.error(err);
});
