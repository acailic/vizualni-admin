import NextLink from "next/link";
/** A link where the default link behavior can be disabled */
export const MaybeLink = ({ disabled, children, ...props }) => {
    if (disabled) {
        return <>{children}</>;
    }
    return <NextLink {...props}>{children}</NextLink>;
};
