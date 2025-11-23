import { t, Trans } from "@lingui/macro";
import { Box, Button, Divider, IconButton, Stack, TextField, Tooltip, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { CopyToClipboardTextInput } from "@/components/copy-to-clipboard-text-input";
import { Flex } from "@/components/flex";
import { Icon } from "@/icons";
import { useI18n } from "@/utils/use-i18n";
import { useScreenshot } from "@/utils/use-screenshot";
/**
 * Enhanced social media sharing component that provides:
 * - Quick share buttons for LinkedIn, X (Twitter), and Facebook
 * - Download visualization as PNG for manual sharing
 * - Customizable share text
 * - Copy-to-clipboard functionality
 */
export const SocialMediaShare = ({ chartWrapperRef, configKey, locale, chartTitle = "", chartDescription = "", }) => {
    const [shareUrl, setShareUrl] = useState("");
    const [shareText, setShareText] = useState("");
    const i18n = useI18n();
    const { loading: downloadingImage, screenshot } = useScreenshot({
        type: "png",
        screenshotName: `chart-${configKey}`,
        screenshotNode: chartWrapperRef.current,
        pngMetadata: [
            { key: "Title", value: chartTitle || "Visualization" },
            { key: "Description", value: chartDescription || "" },
            { key: "Source", value: shareUrl },
            { key: "Software", value: "visualize.admin.ch" },
        ],
    });
    useEffect(() => {
        const url = `${window.location.origin}/${locale}/v/${configKey}`;
        setShareUrl(url);
        setShareText(chartTitle
            ? `${chartTitle} - ${url}`
            : `Check out this visualization - ${url}`);
    }, [configKey, locale, chartTitle]);
    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareOnX = () => {
        const text = chartTitle || "Check out this visualization";
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&via=bafuCH`;
        window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareViaEmail = () => {
        const subject = i18n._(t({
            id: "social.share.mail.subject",
            message: chartTitle || "Visualization from visualize.admin.ch",
        }));
        const body = i18n._(t({
            id: "social.share.mail.body",
            message: `I'd like to share this visualization with you:\n\n${chartTitle || "Visualization"}\n${chartDescription ? `\n${chartDescription}\n` : ""}\n${shareUrl}`,
        }));
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    return (<Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            <Trans id="social.share.title">Share on Social Media</Trans>
          </Typography>
        </Flex>

        {/* Social Media Quick Share Buttons */}
        <Box>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            <Trans id="social.share.quick.description">
              Share directly to your favorite social platform
            </Trans>
          </Typography>
          <Flex sx={{ gap: 1 }}>
            <Tooltip title={i18n._(t({
            id: "social.share.linkedin",
            message: "Share on LinkedIn",
        }))}>
              <IconButton onClick={shareOnLinkedIn} sx={{
            border: 1,
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
        }}>
                <Icon name="linkedIn" size={24}/>
              </IconButton>
            </Tooltip>
            <Tooltip title={i18n._(t({
            id: "social.share.x",
            message: "Share on X (Twitter)",
        }))}>
              <IconButton onClick={shareOnX} sx={{
            border: 1,
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
        }}>
                <Icon name="twitter" size={24}/>
              </IconButton>
            </Tooltip>
            <Tooltip title={i18n._(t({
            id: "social.share.facebook",
            message: "Share on Facebook",
        }))}>
              <IconButton onClick={shareOnFacebook} sx={{
            border: 1,
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
        }}>
                <Icon name="facebook" size={24}/>
              </IconButton>
            </Tooltip>
            <Tooltip title={i18n._(t({
            id: "social.share.email",
            message: "Share via email",
        }))}>
              <IconButton onClick={shareViaEmail} sx={{
            border: 1,
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
        }}>
                <Icon name="envelope" size={24}/>
              </IconButton>
            </Tooltip>
          </Flex>
        </Box>

        <Divider />

        {/* Download as Image for Manual Sharing */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            <Trans id="social.share.download.title">
              Download as Image
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            <Trans id="social.share.download.description">
              Download your visualization as a PNG image to share manually on
              any platform
            </Trans>
          </Typography>
          <Button variant="outlined" startIcon={<Icon name="download" size={20}/>} onClick={screenshot} disabled={downloadingImage || !chartWrapperRef.current}>
            {downloadingImage ? (<Trans id="social.share.download.downloading">
                Downloading...
              </Trans>) : (<Trans id="social.share.download.button">
                Download PNG Image
              </Trans>)}
          </Button>
        </Box>

        <Divider />

        {/* Share URL with customizable text */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            <Trans id="social.share.url.title">Share URL</Trans>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            <Trans id="social.share.url.description">
              Copy and paste this link to share your visualization
            </Trans>
          </Typography>
          <CopyToClipboardTextInput content={shareUrl}/>
        </Box>

        {/* Customizable share text */}
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            <Trans id="social.share.text.title">Share Text</Trans>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            <Trans id="social.share.text.description">
              Customize the text for your social media post
            </Trans>
          </Typography>
          <TextField fullWidth multiline rows={3} value={shareText} onChange={(e) => setShareText(e.target.value)} placeholder={i18n._(t({
            id: "social.share.text.placeholder",
            message: "Enter your share text here...",
        }))} variant="outlined"/>
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => {
            navigator.clipboard.writeText(shareText);
        }} startIcon={<Icon name="copy" size={16}/>}>
              <Trans id="social.share.text.copy">Copy Text</Trans>
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>);
};
