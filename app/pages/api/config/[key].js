import { getConfig } from "../../../db/config";
import { api } from "../../../server/nextkit";
const route = api({
    GET: async ({ req }) => {
        const result = await getConfig(req.query.key);
        if (result) {
            return result;
        }
    },
});
export default route;
