"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const constants_1 = require("./constants");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
const user_1 = require("./resolvers/user");
const type_graphql_1 = require("type-graphql");
const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
const redis = new ioredis_1.default();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "database",
        username: "postgres",
        password: "Tanman11!!",
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [User_1.User],
    });
    console.log(conn.options);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 72,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: "thisisasupersecretkeyiosadf80da0dhwoefgaf",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({ resolvers: [user_1.UserResolver] }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
        }),
        csrfPrevention: true,
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: {
            origin: [
                "http://localhost:3000",
                "https://studio.apollographql.com",
            ],
        },
        path: "/graphql",
    });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000/graphql");
    });
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map