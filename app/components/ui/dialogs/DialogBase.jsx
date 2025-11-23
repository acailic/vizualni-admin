import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, } from "@mui/material";
/**
 * DialogBase component
 *
 * @example
 * // Simple confirmation dialog
 * <DialogBase
 *   open={open}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   content="Are you sure you want to proceed?"
 *   onCancel={handleClose}
 *   onConfirm={handleConfirm}
 * />
 *
 * @example
 * // Custom dialog with form
 * <DialogBase
 *   open={open}
 *   onClose={handleClose}
 *   variant="form"
 *   title="Edit Settings"
 *   content={<form>...</form>}
 *   customActions={<Button type="submit">Save</Button>}
 * />
 */
export const DialogBase = ({ title, content, loading = false, cancelText = "Cancel", confirmText = "Confirm", onCancel, onConfirm, showCancel = true, showConfirm = true, customActions, variant = "default", contentAsText = false, titleVariant = "h5", confirmDisabled = false, confirmVariant = "contained", cancelVariant = "outlined", children, ...dialogProps }) => {
    // Determine dialog styling based on variant
    const paperProps = variant === "confirmation"
        ? { sx: { gap: 4, width: "100%", p: 6 } }
        : undefined;
    const maxWidth = variant === "confirmation" ? "xs" : dialogProps.maxWidth;
    return (<Dialog maxWidth={maxWidth} PaperProps={paperProps} {...dialogProps}>
      {title && (<DialogTitle sx={{
                p: variant === "confirmation" ? 0 : undefined,
                typography: variant === "confirmation" ? "h4" : undefined,
                ...(titleVariant !== "h5" && { typography: titleVariant }),
            }}>
          {typeof title === "string" ? (<Typography variant={titleVariant} component="p" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>) : (title)}
        </DialogTitle>)}

      {(content || children) && (<DialogContent sx={{
                p: variant === "confirmation" ? 0 : undefined,
            }}>
          {contentAsText ? (<DialogContentText sx={{ typography: "body2" }}>
              {content}
            </DialogContentText>) : (content || children)}
        </DialogContent>)}

      {(customActions || showCancel || showConfirm) && (<DialogActions sx={{
                p: variant === "confirmation" ? 0 : undefined,
                ...(variant === "confirmation" && {
                    "& > .MuiButton-root": {
                        justifyContent: "center",
                        minWidth: 76,
                        minHeight: "fit-content",
                        pointerEvents: loading ? "none" : "auto",
                    },
                }),
            }}>
          {customActions ? (customActions) : (<>
              {showCancel && (<Button variant={cancelVariant} onClick={onCancel} disabled={loading}>
                  {cancelText}
                </Button>)}
              {showConfirm && (<Button variant={confirmVariant} onClick={onConfirm} disabled={confirmDisabled || loading}>
                  {loading ? <CircularProgress size={20}/> : confirmText}
                </Button>)}
            </>)}
        </DialogActions>)}
    </Dialog>);
};
export const ConfirmationDialogBase = ({ title = "Are you sure you want to perform this action?", text, yesText = "Yes", noText = "No", ...props }) => {
    return (<DialogBase variant="confirmation" contentAsText title={title} content={text} confirmText={yesText} cancelText={noText} {...props}/>);
};
export const FormDialogBase = ({ formContent, onSubmit, children, customActions, ...props }) => {
    return (<Dialog {...props}>
      <form style={{ display: "contents" }} onSubmit={onSubmit}>
        <DialogBase {...props} open={false} // Prevent nested Dialog
     customActions={customActions}>
          {formContent || children}
        </DialogBase>
      </form>
    </Dialog>);
};
