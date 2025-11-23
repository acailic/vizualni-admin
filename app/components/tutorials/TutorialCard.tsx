import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTutorialProgress } from "@/hooks/useTutorialProgress";

interface TutorialConfig {
  id: string;
  title: { sr: string; en: string };
  description: { sr: string; en: string };
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  icon: string;
  tags: string[];
  steps: any[]; // not needed here
}

interface TutorialCardProps {
  tutorial: TutorialConfig;
  locale: "sr" | "en";
}

export default function TutorialCard({ tutorial, locale }: TutorialCardProps) {
  const progressApi = useTutorialProgress();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const status = progressApi.getTutorialStatus(tutorial.id);
    setIsCompleted(status.completed);
  }, [tutorial.id, progressApi]);

  const title = tutorial.title[locale];
  const description = tutorial.description[locale];

  const difficultyColors = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  };

  const difficultyLabels = {
    sr: { beginner: "Početnik", intermediate: "Srednji", advanced: "Napredni" },
    en: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
  };

  const categoryLabels = {
    sr: {
      "getting-started": "Početak",
      "creating-charts": "Kreiranje Grafika",
      embedding: "Ugrađivanje",
      "api-usage": "Korišćenje API-ja",
      advanced: "Napredno",
    },
    en: {
      "getting-started": "Getting Started",
      "creating-charts": "Creating Charts",
      embedding: "Embedding",
      "api-usage": "API Usage",
      advanced: "Advanced",
    },
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(102, 126, 234, 0.25)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tutorials/${tutorial.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Icon with gradient background */}
          <Box
            sx={{
              fontSize: "3rem",
              mb: 2,
              textAlign: "center",
              p: 2,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              position: "relative",
            }}
          >
            {tutorial.icon}
            {isCompleted && (
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "success.main",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              >
                ✓
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {description}
          </Typography>

          {/* Metadata */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {/* Difficulty */}
            <Chip
              label={difficultyLabels[locale][tutorial.difficulty]}
              size="small"
              color={difficultyColors[tutorial.difficulty]}
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            />

            {/* Estimated Time */}
            <Chip
              label={`${tutorial.estimatedTime} min`}
              size="small"
              sx={{
                fontSize: "0.75rem",
                borderColor: "#667eea",
                color: "#667eea",
                fontWeight: 500,
              }}
              variant="outlined"
            />

            {/* Category */}
            <Chip
              label={
                categoryLabels[locale][tutorial.category] || tutorial.category
              }
              size="small"
              sx={{
                fontSize: "0.75rem",
                borderColor: "#764ba2",
                color: "#764ba2",
                fontWeight: 500,
              }}
              variant="outlined"
            />

            {/* Tag */}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <Chip
                label={tutorial.tags[0]}
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  borderColor: "#f5576c",
                  color: "#f5576c",
                  fontWeight: 500,
                }}
                variant="outlined"
              />
            )}
          </Box>

          {/* Start Tutorial Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              mt: "auto",
            }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/tutorials/${tutorial.id}`;
            }}
          >
            {locale === "sr" ? "Započni Tutorijal" : "Start Tutorial"}
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
