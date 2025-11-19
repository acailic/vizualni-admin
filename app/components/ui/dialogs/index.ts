/**
 * Reusable Dialog components
 *
 * This module provides base dialog components that consolidate common patterns
 * found across the codebase. The components offer:
 *
 * - **DialogBase**: Flexible base component with customizable sections
 * - **ConfirmationDialogBase**: Pre-configured for yes/no confirmations
 * - **FormDialogBase**: Pre-configured for form submissions
 *
 * These components replace duplicated dialog patterns and provide a consistent
 * API for creating dialogs throughout the application.
 *
 * @example
 * // Simple confirmation
 * import { ConfirmationDialogBase } from '@/components/ui/dialogs';
 *
 * <ConfirmationDialogBase
 *   open={open}
 *   onClose={handleClose}
 *   title="Delete Chart?"
 *   text="This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onCancel={handleClose}
 * />
 *
 * @example
 * // Form dialog
 * import { FormDialogBase } from '@/components/ui/dialogs';
 *
 * <FormDialogBase
 *   open={open}
 *   onClose={handleClose}
 *   title="Edit Settings"
 *   onSubmit={handleSubmit}
 * >
 *   <Input name="name" label="Name" />
 * </FormDialogBase>
 */

export {
  DialogBase,
  ConfirmationDialogBase,
  FormDialogBase,
  type DialogBaseProps,
  type ConfirmationDialogBaseProps,
  type FormDialogBaseProps,
} from "./DialogBase";
