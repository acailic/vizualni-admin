import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

/**
 * Base Dialog component with common patterns and configurations
 *
 * This component consolidates common dialog patterns found across the codebase:
 * - Consistent spacing and styling
 * - Standard title, content, and actions structure
 * - Loading states
 * - Cancel and confirm buttons
 *
 * It can be used directly or extended for specific use cases like
 * ConfirmationDialog, FormDialog, etc.
 */

export type DialogBaseProps = DialogProps & {
  /** Dialog title text or element */
  title?: ReactNode;
  /** Dialog content text or element */
  content?: ReactNode;
  /** Whether to show loading state */
  loading?: boolean;
  /** Cancel button text */
  cancelText?: ReactNode;
  /** Confirm button text */
  confirmText?: ReactNode;
  /** Cancel button click handler */
  onCancel?: () => void;
  /** Confirm button click handler */
  onConfirm?: () => void | Promise<void>;
  /** Whether to show the cancel button */
  showCancel?: boolean;
  /** Whether to show the confirm button */
  showConfirm?: boolean;
  /** Custom actions to render instead of default buttons */
  customActions?: ReactNode;
  /** Variant for dialog type */
  variant?: "default" | "confirmation" | "form";
  /** Whether content should be rendered as text */
  contentAsText?: boolean;
  /** Custom title typography variant */
  titleVariant?: "h4" | "h5" | "h6";
  /** Whether to disable confirm button */
  confirmDisabled?: boolean;
  /** Confirm button variant */
  confirmVariant?: "text" | "outlined" | "contained";
  /** Cancel button variant */
  cancelVariant?: "text" | "outlined" | "contained";
};

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
export const DialogBase = ({
  title,
  content,
  loading = false,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  showCancel = true,
  showConfirm = true,
  customActions,
  variant = "default",
  contentAsText = false,
  titleVariant = "h5",
  confirmDisabled = false,
  confirmVariant = "contained",
  cancelVariant = "outlined",
  children,
  ...dialogProps
}: DialogBaseProps) => {
  // Determine dialog styling based on variant
  const paperProps =
    variant === "confirmation"
      ? { sx: { gap: 4, width: "100%", p: 6 } }
      : undefined;

  const maxWidth = variant === "confirmation" ? "xs" : dialogProps.maxWidth;

  return (
    <Dialog
      maxWidth={maxWidth}
      PaperProps={paperProps}
      {...dialogProps}
    >
      {title && (
        <DialogTitle
          sx={{
            p: variant === "confirmation" ? 0 : undefined,
            typography: variant === "confirmation" ? "h4" : undefined,
            ...(titleVariant !== "h5" && { typography: titleVariant }),
          }}
        >
          {typeof title === "string" ? (
            <Typography
              variant={titleVariant}
              component="p"
              sx={{ fontWeight: 700 }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
        </DialogTitle>
      )}

      {(content || children) && (
        <DialogContent
          sx={{
            p: variant === "confirmation" ? 0 : undefined,
          }}
        >
          {contentAsText ? (
            <DialogContentText sx={{ typography: "body2" }}>
              {content}
            </DialogContentText>
          ) : (
            content || children
          )}
        </DialogContent>
      )}

      {(customActions || showCancel || showConfirm) && (
        <DialogActions
          sx={{
            p: variant === "confirmation" ? 0 : undefined,
            ...(variant === "confirmation" && {
              "& > .MuiButton-root": {
                justifyContent: "center",
                minWidth: 76,
                minHeight: "fit-content",
                pointerEvents: loading ? "none" : "auto",
              },
            }),
          }}
        >
          {customActions ? (
            customActions
          ) : (
            <>
              {showCancel && (
                <Button
                  variant={cancelVariant}
                  onClick={onCancel}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
              )}
              {showConfirm && (
                <Button
                  variant={confirmVariant}
                  onClick={onConfirm}
                  disabled={confirmDisabled || loading}
                >
                  {loading ? <CircularProgress size={20} /> : confirmText}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

/**
 * Confirmation Dialog variant
 * Pre-configured for confirmation use cases
 */
export type ConfirmationDialogBaseProps = Omit<
  DialogBaseProps,
  "variant" | "contentAsText"
> & {
  /** Confirmation text/question */
  text?: string;
  /** Yes button text */
  yesText?: ReactNode;
  /** No button text */
  noText?: ReactNode;
};

export const ConfirmationDialogBase = ({
  title = "Are you sure you want to perform this action?",
  text,
  yesText = "Yes",
  noText = "No",
  ...props
}: ConfirmationDialogBaseProps) => {
  return (
    <DialogBase
      variant="confirmation"
      contentAsText
      title={title}
      content={text}
      confirmText={yesText}
      cancelText={noText}
      {...props}
    />
  );
};

/**
 * Form Dialog variant
 * Pre-configured for form use cases
 */
export type FormDialogBaseProps = Omit<DialogBaseProps, "variant"> & {
  /** Form content */
  formContent?: ReactNode;
  /** Form submit handler */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export const FormDialogBase = ({
  formContent,
  onSubmit,
  children,
  customActions,
  ...props
}: FormDialogBaseProps) => {
  return (
    <Dialog {...props}>
      <form
        style={{ display: "contents" }}
        onSubmit={onSubmit}
      >
        <DialogBase
          {...props}
          open={false} // Prevent nested Dialog
          customActions={customActions}
        >
          {formContent || children}
        </DialogBase>
      </form>
    </Dialog>
  );
};
