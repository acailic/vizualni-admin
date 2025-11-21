import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Box, Button, IconButton, Typography, Chip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
  maxLines?: number;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  fileName,
  maxLines = 20,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = code.split('\n').length;
  const showExpand = lines > maxLines;
  const displayCode = showExpand && !expanded ? code.split('\n').slice(0, maxLines).join('\n') + '\n...' : code;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        fontFamily: 'monospace',
        backgroundColor: '#f8f8f8',
      }}
    >
      {fileName && (
        <Box
          sx={{
            backgroundColor: '#e0e0e0',
            padding: '8px 16px',
            borderBottom: '1px solid #d0d0d0',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {fileName}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Chip
          label={language.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: '#007acc',
            color: 'white',
            fontSize: '0.75rem',
          }}
        />
        <Box>
          <IconButton size="small" onClick={handleCopy} sx={{ color: '#666' }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          {copied && (
            <Typography variant="caption" sx={{ ml: 1, color: '#007acc' }}>
              Copied!
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Highlight
          theme={themes.github}
          code={displayCode}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                margin: 0,
                padding: '16px',
                overflow: 'auto',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              className={className}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} style={{ display: 'flex' }}>
                  {showLineNumbers && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '40px',
                        textAlign: 'right',
                        color: '#999',
                        userSelect: 'none',
                        marginRight: '16px',
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        {showExpand && (
          <Box sx={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f0f0' }}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: 'none' }}
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodeBlock;