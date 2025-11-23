import { $createLinkNode, $isLinkNode } from "@lexical/link";
import { t } from "@lingui/macro";
import { activeEditor$, addComposerChild$, createActiveEditorSubscription$, currentSelection$, editorRootElementRef$, getSelectedNode, getSelectionRectangle, IS_APPLE, readOnly$, realmPlugin, } from "@mdxeditor/editor";
import { Action, Cell, filter, map, Signal, useCellValues, usePublisher, withLatestFrom, } from "@mdxeditor/gurx";
import { Button, ClickAwayListener, Fade, Input, Link, Paper, Popper, Typography, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { $createTextNode, $getSelection, $insertNodes, $isRangeSelection, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, KEY_ESCAPE_COMMAND, KEY_MODIFIER_COMMAND, } from "lexical";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToolbarIconButton } from "@/components/mdx-editor/common";
import { Icon } from "@/icons";
import { useTimedPrevious } from "@/utils/use-timed-previous";
const getLinkNodeInSelection = (selection) => {
    if (!selection) {
        return null;
    }
    const node = getSelectedNode(selection);
    if (node === null) {
        return null;
    }
    const parent = node.getParent();
    if ($isLinkNode(parent)) {
        return parent;
    }
    else if ($isLinkNode(node)) {
        return node;
    }
    return null;
};
const onWindowChange$ = Signal();
const state$ = Cell({ type: "inactive" }, (r) => {
    r.pub(createActiveEditorSubscription$, (editor) => {
        return editor.registerCommand(KEY_ESCAPE_COMMAND, () => {
            const state = r.getValue(state$);
            if (state.type === "preview") {
                r.pub(state$, { type: "inactive" });
                return true;
            }
            return false;
        }, COMMAND_PRIORITY_LOW);
    });
    r.pub(createActiveEditorSubscription$, (editor) => {
        return editor.registerCommand(KEY_MODIFIER_COMMAND, (e) => {
            if (e.key === "k" &&
                (IS_APPLE ? e.metaKey : e.ctrlKey) &&
                !r.getValue(readOnly$)) {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    r.pub(openLinkEditDialog$);
                    e.stopPropagation();
                    e.preventDefault();
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        }, COMMAND_PRIORITY_HIGH);
    });
    r.link(r.pipe(switchFromPreviewToLinkEdit$, withLatestFrom(state$), map(([, state]) => {
        if (state.type === "preview") {
            return {
                type: "edit",
                initialUrl: state.url,
                url: state.url,
                text: state.text,
                linkNodeKey: state.linkNodeKey,
                rectangle: state.rectangle,
            };
        }
        else {
            throw new Error("Cannot switch to edit mode when not in preview mode!");
        }
    })), state$);
    r.sub(r.pipe(updateLink$, withLatestFrom(activeEditor$, state$, currentSelection$)), ([payload, editor, state, selection]) => {
        var _a, _b, _c, _d;
        const url = (_b = (_a = payload.url) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
        const text = (_d = (_c = payload.text) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : "";
        if (url !== "") {
            const linkContent = text || url;
            editor === null || editor === void 0 ? void 0 : editor.update(() => {
                const linkNode = getLinkNodeInSelection(selection);
                linkNode === null || linkNode === void 0 ? void 0 : linkNode.remove();
                const newLinkNode = $createLinkNode(url);
                newLinkNode.append($createTextNode(linkContent));
                $insertNodes([newLinkNode]);
                newLinkNode.select();
            }, { discrete: true });
            r.pub(state$, {
                type: "preview",
                linkNodeKey: state.linkNodeKey,
                rectangle: state.rectangle,
                text,
                url,
            });
        }
        else {
            r.pub(state$, {
                type: "inactive",
            });
        }
    });
    r.link(r.pipe(cancelLinkEdit$, withLatestFrom(state$, activeEditor$), map(([, state, editor]) => {
        if (state.type === "edit") {
            editor === null || editor === void 0 ? void 0 : editor.focus();
            if (state.initialUrl === "") {
                return {
                    type: "inactive",
                };
            }
            else {
                return {
                    type: "preview",
                    url: state.initialUrl,
                    linkNodeKey: state.linkNodeKey,
                    rectangle: state.rectangle,
                };
            }
        }
        else {
            throw new Error("Cannot cancel edit when not in edit mode!");
        }
    })), state$);
    r.link(r.pipe(r.combine(currentSelection$, onWindowChange$), withLatestFrom(activeEditor$, state$, readOnly$), map(([[selection], activeEditor, _, readOnly]) => {
        if ($isRangeSelection(selection) && activeEditor && !readOnly) {
            const node = getLinkNodeInSelection(selection);
            if (node) {
                return {
                    type: "preview",
                    url: node.getURL(),
                    linkNodeKey: node.getKey(),
                    text: node.getTextContent(),
                    rectangle: getSelectionRectangle(activeEditor),
                };
            }
            else {
                return { type: "inactive" };
            }
        }
        else {
            return { type: "inactive" };
        }
    })), state$);
});
const updateLink$ = Signal();
const cancelLinkEdit$ = Action();
const switchFromPreviewToLinkEdit$ = Action();
export const openLinkEditDialog$ = Action((r) => {
    r.sub(r.pipe(openLinkEditDialog$, withLatestFrom(currentSelection$, activeEditor$), filter(([, selection]) => $isRangeSelection(selection))), ([, selection, editor]) => {
        editor === null || editor === void 0 ? void 0 : editor.focus(() => {
            editor.getEditorState().read(() => {
                var _a, _b, _c, _d;
                const linkNode = getLinkNodeInSelection(selection);
                const rectangle = getSelectionRectangle(editor);
                if (selection || linkNode) {
                    const key = (_a = linkNode === null || linkNode === void 0 ? void 0 : linkNode.getKey()) !== null && _a !== void 0 ? _a : "";
                    const url = (_b = linkNode === null || linkNode === void 0 ? void 0 : linkNode.getURL()) !== null && _b !== void 0 ? _b : "";
                    const text = (_d = (_c = selection === null || selection === void 0 ? void 0 : selection.getTextContent()) !== null && _c !== void 0 ? _c : linkNode === null || linkNode === void 0 ? void 0 : linkNode.getTextContent()) !== null && _d !== void 0 ? _d : "";
                    r.pub(state$, {
                        type: "edit",
                        initialUrl: url,
                        initialText: text,
                        url,
                        text,
                        linkNodeKey: key,
                        rectangle,
                    });
                }
                else {
                    r.pub(state$, {
                        type: "edit",
                        initialUrl: "",
                        initialText: "",
                        text: "",
                        url: "",
                        linkNodeKey: "",
                        rectangle,
                    });
                }
            });
        });
    });
});
export const linkDialogPlugin = realmPlugin({
    init(r) {
        r.pub(addComposerChild$, LinkDialog);
    },
    update() { },
});
const LinkEditForm = ({ url, text, onSubmit, onCancel, }) => {
    const classes = useLinkEditFormStyles();
    const { register, handleSubmit } = useForm({
        values: {
            url,
            text,
        },
    });
    return (<ClickAwayListener onClickAway={() => {
            try {
                onCancel();
            }
            catch (e) { }
        }}>
      <form className={classes.form} onSubmit={(e) => {
            void handleSubmit(({ url, text }) => {
                url = url.trim();
                if (!/^https?:\/\//i.test(url)) {
                    url = "https://" + url;
                }
                onSubmit({ url, text });
            })(e);
            e.stopPropagation();
            e.preventDefault();
        }} onReset={(e) => {
            e.stopPropagation();
            onCancel();
        }}>
        <Input id="link-text" className={classes.input} size="sm" {...register("text")} placeholder={t({
            id: "mdx-editor.link-dialog.label-placeholder",
            message: "Label...",
        })} autoFocus/>
        <Input id="link-url" className={classes.input} size="sm" type="text" placeholder={t({
            id: "mdx-editor.link-dialog.url-placeholder",
            message: "URL...",
        })} inputProps={{
            pattern: "https?://.*|www\\..*",
            title: "Enter a valid URL starting with https:// or www.",
        }} {...register("url")}/>
        <div className={classes.buttonGroup}>
          <Button type="reset" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </ClickAwayListener>);
};
const useLinkEditFormStyles = makeStyles((theme) => ({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
        width: 400,
        padding: theme.spacing(2),
    },
    input: {
        width: "100%",
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(2),
    },
}));
const TIMEOUT_MS = 350;
const LinkDialog = () => {
    var _a, _b, _c;
    const classes = useLinkDialogStyles();
    const [editorRootElementRef, activeEditor, state] = useCellValues(editorRootElementRef$, activeEditor$, state$);
    const delayedState = useTimedPrevious(state, TIMEOUT_MS);
    const maybeDelayedState = state.type === "inactive" ? delayedState : state;
    const publishWindowChange = usePublisher(onWindowChange$);
    const updateLink = usePublisher(updateLink$);
    const cancelLinkEdit = usePublisher(cancelLinkEdit$);
    const switchFromPreviewToLinkEdit = usePublisher(switchFromPreviewToLinkEdit$);
    const urlIsExternal = maybeDelayedState.type === "preview" &&
        maybeDelayedState.url.startsWith("http");
    useEffect(() => {
        const update = () => {
            activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.getEditorState().read(() => {
                publishWindowChange(true);
            });
        };
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, [activeEditor, publishWindowChange]);
    const maybeDelayedRectangle = maybeDelayedState.rectangle;
    const maybeDelayedRectangleRef = useRef(null);
    const rectangle = maybeDelayedRectangle !== null && maybeDelayedRectangle !== void 0 ? maybeDelayedRectangle : maybeDelayedRectangleRef.current;
    useEffect(() => {
        if (maybeDelayedRectangle) {
            maybeDelayedRectangleRef.current = maybeDelayedRectangle;
        }
    }, [maybeDelayedRectangle]);
    return (<Popper className={classes.popper} open={state.type !== "inactive"} anchorEl={editorRootElementRef === null || editorRootElementRef === void 0 ? void 0 : editorRootElementRef.current} transition sx={{
            top: `${((_a = rectangle === null || rectangle === void 0 ? void 0 : rectangle.top) !== null && _a !== void 0 ? _a : 0) + ((_b = rectangle === null || rectangle === void 0 ? void 0 : rectangle.height) !== null && _b !== void 0 ? _b : 0) + 4}px !important`,
            left: `${(_c = rectangle === null || rectangle === void 0 ? void 0 : rectangle.left) !== null && _c !== void 0 ? _c : 0}px !important`,
        }}>
      {({ TransitionProps }) => (<Fade {...TransitionProps} timeout={TIMEOUT_MS}>
          <Paper className={classes.popperContent}>
            {maybeDelayedState.type === "edit" && (<LinkEditForm url={maybeDelayedState.url} text={maybeDelayedState.text} onSubmit={updateLink} onCancel={cancelLinkEdit.bind(null)}/>)}
            {maybeDelayedState.type === "preview" && (<>
                <Link className={classes.previewLink} href={maybeDelayedState.url} {...(urlIsExternal
                ? { target: "_blank", rel: "noreferrer" }
                : {})}>
                  <Typography className={classes.previewLinkText}>
                    {maybeDelayedState.url}
                  </Typography>
                  {urlIsExternal ? (<Icon name="legacyLinkExternal" size={16}/>) : null}
                </Link>
                <ToolbarIconButton onClick={() => {
                    switchFromPreviewToLinkEdit();
                }}>
                  <Icon name="pen"/>
                </ToolbarIconButton>
              </>)}
          </Paper>
        </Fade>)}
    </Popper>);
};
const useLinkDialogStyles = makeStyles((theme) => ({
    popper: {
        zIndex: 2000,
        position: "fixed !important",
        width: "fit-content",
        height: "fit-content",
        transform: "none !important",
    },
    popperContent: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        padding: theme.spacing(1),
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
    },
    previewLink: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
    },
    previewLinkText: {
        margin: `0 ${theme.spacing(1)}`,
    },
}));
