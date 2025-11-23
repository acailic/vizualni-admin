import { Link, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Flex } from "@/components/flex";
const useStyles = makeStyles((theme) => ({
    errorPageHint: {
        width: "100%",
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
    },
}));
export const ErrorPageHint = ({ children }) => {
    const classes = useStyles();
    return <Flex className={classes.errorPageHint}>{children}</Flex>;
};
export const Actions = ({ children }) => {
    return (<Flex sx={{
            mb: 6,
            fontSize: ["1rem", "1.125rem", "1.125rem"],
            display: "inline",
        }}>
      {children}
    </Flex>);
};
export const HomeLink = ({ locale, children, }) => {
    return (<NextLink href="/" locale={locale} passHref legacyBehavior>
      <Link sx={{
            backgroundColor: "transparent",
            color: "primary",
            textDecoration: "underline",
            cursor: "pointer",
        }}>
        {children}
      </Link>
    </NextLink>);
};
export const ReloadButton = ({ children }) => {
    const router = useRouter();
    return (<Typography onClick={() => router.reload()} sx={{
            backgroundColor: "transparent",
            color: "primary",
            textDecoration: "underline",
            cursor: "pointer",
        }}>
      {children}
    </Typography>);
};
