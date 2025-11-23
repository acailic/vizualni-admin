import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChartPublished } from "@/components/chart-published";
import { ConfiguratorStateProvider, } from "@/configurator";
import { migrateConfiguratorState } from "@/utils/chart-config/versioning";
const Page = () => {
    const router = useRouter();
    const { env, slug } = router.query;
    const [config, setConfig] = useState();
    useEffect(() => {
        if (!env || !slug)
            return;
        const run = async () => {
            const importedConfig = (await import(`../../../test/__fixtures/config/${env}/${slug}`)).default;
            setConfig({
                ...importedConfig,
                data: await migrateConfiguratorState(importedConfig.data),
            });
        };
        run();
    }, [env, slug]);
    if (config) {
        return (<ConfiguratorStateProvider chartId="published" initialState={{
                ...config.data,
                state: "PUBLISHED",
            }}>
        <ChartPublished />
      </ConfiguratorStateProvider>);
    }
    return null;
};
export default Page;
