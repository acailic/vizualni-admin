import { t, Trans } from "@lingui/macro";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useEventCallback, } from "@mui/material";
import { Flex } from "@/components/flex";
import { Input } from "@/components/form";
import { useUserConfigs } from "@/domain/user-configs";
import { updateConfig } from "@/utils/chart-config/api";
import { useMutate } from "@/utils/use-fetch-data";
export const RenameDialog = ({ config, locale, onClose, userId, ...props }) => {
    const { invalidate: invalidateUserConfigs } = useUserConfigs();
    const updateConfigMut = useMutate(updateConfig);
    const isSingleChart = config.data.chartConfigs.length === 1;
    const handleRename = useEventCallback(async (ev) => {
        ev.preventDefault();
        const formData = Object.fromEntries(new FormData(ev.currentTarget).entries());
        if (isSingleChart) {
            const chartConfig = config.data.chartConfigs[0];
            await updateConfigMut.mutate({
                key: config.key,
                data: {
                    ...config.data,
                    chartConfigs: [
                        {
                            ...chartConfig,
                            meta: {
                                ...chartConfig.meta,
                                title: formData !== null && formData !== void 0 ? formData : chartConfig.meta.title,
                            },
                        },
                    ],
                },
            });
        }
        else {
            const layout = config.data.layout;
            await updateConfigMut.mutate({
                key: config.key,
                data: {
                    ...config.data,
                    layout: {
                        ...layout,
                        meta: {
                            ...layout.meta,
                            title: formData !== null && formData !== void 0 ? formData : layout.meta.title,
                        },
                    },
                },
            });
        }
        invalidateUserConfigs();
        onClose === null || onClose === void 0 ? void 0 : onClose();
    });
    const meta = isSingleChart
        ? config.data.chartConfigs[0].meta
        : config.data.layout.meta;
    return (<Dialog {...props} fullWidth>
      <form style={{ display: "contents" }} onSubmit={handleRename}>
        <DialogTitle>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
            <Trans id="profile.chart.rename-dialog.title">
              Rename the visualization
            </Trans>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Flex sx={{ flexDirection: "column", gap: 4 }}>
            <Input name="sr-Latn" label={t({
            id: "controls.language.serbian-latin",
            message: "Serbian (Latin)",
        })} defaultValue={meta.title["sr-Latn"]}/>
            <Input name="sr-Cyrl" label={t({
            id: "controls.language.serbian-cyrillic",
            message: "Serbian (Cyrillic)",
        })} defaultValue={meta.title["sr-Cyrl"]}/>
            <Input name="en" label={t({ id: "controls.language.english" })} defaultValue={meta.title.en}/>
          </Flex>
        </DialogContent>
        <DialogActions sx={{ pb: 6, pr: 6 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={updateConfigMut.status === "fetching"} sx={{ minWidth: "auto" }}>
            Ok
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>);
};
