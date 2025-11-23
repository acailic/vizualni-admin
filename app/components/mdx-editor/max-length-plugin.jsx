import { trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import { createRootEditorSubscription$, realmPlugin, } from "@mdxeditor/editor";
import { $getSelection, $isRangeSelection, RootNode, } from "lexical";
export const maxLengthPlugin = realmPlugin({
    // @ts-expect-error - this works.
    init: (realm, { maxLength = Infinity, onChange, }) => {
        realm.pub(createRootEditorSubscription$, (editor) => {
            let lastRestoredEditorState = null;
            return editor.registerNodeTransform(RootNode, (rootNode) => {
                if (!maxLength) {
                    return;
                }
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
                    return;
                }
                const prevEditorState = editor.getEditorState();
                const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
                const textContentSize = rootNode.getTextContentSize();
                if (prevTextContentSize !== textContentSize) {
                    const delCount = textContentSize - maxLength;
                    const anchor = selection.anchor;
                    if (delCount >= 0) {
                        onChange({ reachedMaxLength: true });
                        if (prevTextContentSize === maxLength &&
                            lastRestoredEditorState !== prevEditorState) {
                            lastRestoredEditorState = prevEditorState;
                            $restoreEditorState(editor, prevEditorState);
                        }
                        else {
                            trimTextContentFromAnchor(editor, anchor, delCount);
                        }
                    }
                    else {
                        onChange({ reachedMaxLength: false });
                    }
                }
            });
        });
    },
});
