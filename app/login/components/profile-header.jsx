import { Trans } from "@lingui/macro";
import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
import { ADFS_PROFILE_URL } from "@/domain/env";
import { Icon } from "@/icons";
import { useRootStyles } from "@/login/utils";
const useStyles = makeStyles((theme) => ({
    section: {
        paddingTop: theme.spacing(6),
    },
    topRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing(1),
    },
    button: {
        width: "fit-content",
    },
}));
export const ProfileHeader = (props) => {
    const { user } = props;
    const rootClasses = useRootStyles();
    const classes = useStyles();
    return (<Box className={clsx(rootClasses.section, classes.section)}>
      <Box className={rootClasses.sectionContent}>
        <Box className={classes.topRow}>
          <Typography variant="h1" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <BrowseButton />
        </Box>
        {ADFS_PROFILE_URL && (<Button className={classes.button} component="a" href={ADFS_PROFILE_URL} variant="text" color="primary" size="sm" sx={{ mr: 2 }}>
            eIAM MyAccount
          </Button>)}
        <Button className={classes.button} variant="text" color="primary" size="sm" onClick={async () => await signOut()}>
          <Trans id="login.sign-out">Sign out</Trans>
        </Button>
      </Box>
    </Box>);
};
const BrowseButton = () => {
    return (<NextLink href="/browse" passHref legacyBehavior>
      <Button size="sm" endIcon={<Icon name="arrowRight" size={20}/>}>
        <Trans id="browse.dataset.all">Browse all datasets</Trans>
      </Button>
    </NextLink>);
};
