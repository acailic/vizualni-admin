import { Menu, MenuItem, Button, Box, Typography } from "@mui/material";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useLocale } from "@/locales/use-locale";
import localeConfig from "@/locales/locales.json";

interface LocaleInfo {
  code: string;
  label: string;
  flag: string;
}

const LOCALE_INFO: Record<string, LocaleInfo> = {
  "sr-Latn": {
    code: "sr-Latn",
    label: "Srpski (Latinica)",
    flag: "🇷🇸",
  },
  "sr-Cyrl": {
    code: "sr-Cyrl",
    label: "Српски (Ћирилица)",
    flag: "🇷🇸",
  },
  en: {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
};

export const LanguagePicker = () => {
  const currentLocale = useLocale();
  const { push, pathname, query } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (locale: string) => {
    push({ pathname, query }, undefined, { locale });
    handleClose();
  };

  const currentLocaleInfo = LOCALE_INFO[currentLocale] || LOCALE_INFO["sr-Latn"];

  return (
    <Box>
      <Button
        id="language-picker-button"
        aria-controls={open ? "language-picker-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>{currentLocaleInfo.flag}</span>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentLocaleInfo.label}
          </Typography>
        </Box>
      </Button>
      <Menu
        id="language-picker-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-picker-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {localeConfig.locales.map((locale) => {
          const localeInfo = LOCALE_INFO[locale];
          if (!localeInfo) return null;

          return (
            <MenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              selected={locale === currentLocale}
              sx={{
                minWidth: 200,
                gap: 1.5,
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{localeInfo.flag}</span>
              <Typography variant="body2">{localeInfo.label}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
