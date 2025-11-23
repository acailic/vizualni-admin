import { useRouter } from "next/router";
import { SelectDatasetStep } from "@/browse/ui/select-dataset-step";
import { AppLayout } from "@/components/layout";
import { ConfiguratorStateProvider } from "@/configurator/configurator-state";
export function DatasetBrowser() {
    const router = useRouter();
    const hideHeader = router.query.odsiframe === "true";
    return (<AppLayout hideHeader={hideHeader}>
      <ConfiguratorStateProvider chartId="new" allowDefaultRedirect={false}>
        <SelectDatasetStep variant="page"/>
      </ConfiguratorStateProvider>
    </AppLayout>);
}
export default DatasetBrowser;
