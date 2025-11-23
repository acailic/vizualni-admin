import { getServerSession } from "next-auth";
import { createConfig, getConfig, removeConfig, updateConfig, } from "@/db/config";
import { isDataSourceUrlAllowed } from "@/domain/data-source";
import { nextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { controller } from "@/server/nextkit";
export const ConfigController = controller({
    create: withAuth(async ({ userId }, req) => {
        const { data, published_state } = req.body;
        if (!isDataSourceUrlAllowed(data.dataSource.url)) {
            throw Error("Invalid data source!");
        }
        return await createConfig({
            key: data.key,
            data,
            userId,
            published_state: published_state,
        });
    }),
    remove: withAuth(async ({ userId }, req) => {
        const { key } = req.body;
        const config = await getConfig(key);
        if (userId !== (config === null || config === void 0 ? void 0 : config.user_id)) {
            throw Error("Unauthorized!");
        }
        return await removeConfig({ key });
    }),
    update: withAuth(async ({ userId }, req) => {
        const { key, data, published_state } = req.body;
        if (!userId) {
            throw Error("Could not update config: Not logged in users cannot update a chart");
        }
        const config = await getConfig(key);
        if (!config) {
            throw Error("Could not update config: config not found");
        }
        if (userId !== config.user_id) {
            throw Error(`Could not update config: config must be edited by its author (config user id: ${config === null || config === void 0 ? void 0 : config.user_id}, server user id: ${userId})`);
        }
        if (!isDataSourceUrlAllowed(data.dataSource.url)) {
            throw Error("Invalid data source!");
        }
        return await updateConfig({
            key,
            data,
            published_state,
        });
    }),
});
function withAuth(handler) {
    return async ({ req, res }) => {
        var _a;
        const session = await getServerSession(req, res, nextAuthOptions);
        const userId = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id;
        return handler({ userId }, req, res);
    };
}
