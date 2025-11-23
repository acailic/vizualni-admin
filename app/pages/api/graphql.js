import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-micro";
import configureCors from "cors";
import "global-agent/bootstrap";
import { constraintDirective, constraintDirectiveTypeDefs, } from "graphql-constraint-directive";
import depthLimit from "graphql-depth-limit";
import { SentryPlugin } from "@/graphql/apollo-sentry-plugin";
import { createContext } from "../../graphql/context";
import { resolvers } from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema.graphql";
import { runMiddleware } from "../../utils/run-middleware";
// Ability to load graphql responses from Storybook
const corsOrigin = process.env.NODE_ENV === "production" ? undefined : "*";
export const cors = configureCors({
    origin: corsOrigin,
});
const schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
    schemaTransforms: [constraintDirective()],
});
const server = new ApolloServer({
    schema,
    formatError: (err) => {
        var _a, _b;
        console.error(err, (_b = (_a = err === null || err === void 0 ? void 0 : err.extensions) === null || _a === void 0 ? void 0 : _a.exception) === null || _b === void 0 ? void 0 : _b.stacktrace);
        return err;
    },
    formatResponse: (response, reqCtx) => {
        const context = reqCtx.context;
        if (context.debug) {
            response.extensions = {
                queries: context.queries,
                timings: context.timings,
            };
        }
        return response;
    },
    context: createContext,
    cache: "bounded",
    introspection: process.env.NODE_ENV !== "production",
    validationRules: [depthLimit(1)],
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground,
        ...(process.env.NODE_ENV === "production" ? [SentryPlugin] : []),
    ],
});
export const config = {
    api: {
        bodyParser: false,
    },
    // see https://vercel.com/docs/functions/configuring-functions/duration
    maxDuration: 60,
};
const start = server.start();
const GraphQLPage = async (req, res) => {
    await start;
    await runMiddleware(req, res, cors);
    const handler = server.createHandler({ path: "/api/graphql" });
    return handler(req, res);
};
export default GraphQLPage;
