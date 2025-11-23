import { t, Trans } from "@lingui/macro";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import { useState } from "react";
import { sleep } from "@/utils/sleep";
export const ConfirmationDialog = ({ title, text, onClick, onSuccess, onConfirm, ...props }) => {
    const [loading, setLoading] = useState(false);
    return (<Dialog maxWidth="xs" PaperProps={{ sx: { gap: 4, width: "100%", p: 6 } }} {...props}>
      <DialogTitle sx={{ p: 0, typography: "h4" }}>
        {title ||
            t({
                id: "login.profile.chart.confirmation.default",
                message: "Are you sure you want to perform this action?",
            })}
      </DialogTitle>
      {text && (<DialogContent sx={{ p: 0 }}>
          <DialogContentText sx={{ typography: "body2" }}>
            {text}
          </DialogContentText>
        </DialogContent>)}
      <DialogActions sx={{
            p: 0,
            "& > .MuiButton-root": {
                justifyContent: "center",
                minWidth: 76,
                minHeight: "fit-content",
                pointerEvents: loading ? "none" : "auto",
            },
        }}>
        <Button variant="outlined" onClick={() => props.onClose({}, "escapeKeyDown")}>
          <Trans id="no">No</Trans>
        </Button>
        <Button variant="contained" onClick={async (e) => {
            e.stopPropagation();
            setLoading(true);
            await onClick(e);
            await sleep(100);
            props.onClose({}, "escapeKeyDown");
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }}>
          {loading ? <CircularProgress /> : <Trans id="yes">Yes</Trans>}
        </Button>
      </DialogActions>
    </Dialog>);
};
