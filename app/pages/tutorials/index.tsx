/**
 * Tutorials landing page - showcases all available tutorials
 */

import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";

import { DemoLayout } from "@/components/demos/demo-layout";
import TutorialCard from "@/components/tutorials/TutorialCard";
import TutorialSearch from "@/components/tutorials/TutorialSearch";
import { TUTORIAL_CONFIGS, TutorialConfig } from "@/lib/tutorials/config";

export default function TutorialsIndex() {
  const router = useRouter();
  const locale = (router.locale || "sr") as "sr" | "en";

  const [filteredTutorials, setFilteredTutorials] = useState<TutorialConfig[]>(
    []
  );

  const pageTitle = locale === "sr" ? "Tutorijali" : "Tutorials";
  const pageDescription =
    locale === "sr"
      ? "Naučite kako da koristite Vizualni Admin za kreiranje vizualizacija otvorenih podataka"
      : "Learn how to use Vizualni Admin to create visualizations of open data";

  // Flatten tutorials for filtering
  const allTutorials = useMemo(() => {
    const tutorials: TutorialConfig[] = [];
    Object.values(TUTORIAL_CONFIGS).forEach((categoryTutorials) => {
      tutorials.push(...categoryTutorials);
    });
    return tutorials;
  }, []);

  // Group filtered tutorials by category
  const tutorialsByCategory = useMemo(() => {
    const grouped: Record<string, TutorialConfig[]> = {};
    filteredTutorials.forEach((tutorial) => {
      if (!grouped[tutorial.category]) {
        grouped[tutorial.category] = [];
      }
      grouped[tutorial.category].push(tutorial);
    });
    return grouped;
  }, [filteredTutorials]);

  const getCategoryLabel = (category: string, locale: "sr" | "en") => {
    const labels = {
      "getting-started": { sr: "Početak", en: "Getting Started" },
      "creating-charts": { sr: "Kreiranje Grafikona", en: "Creating Charts" },
      embedding: { sr: "Ugrađivanje", en: "Embedding" },
      "api-usage": { sr: "Korišćenje API-ja", en: "API Usage" },
      advanced: { sr: "Napredno", en: "Advanced" },
    };
    return labels[category as keyof typeof labels]?.[locale] || category;
  };

  return (
    <DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      {/* Intro Section */}
      <Box
        sx={{
          mb: 6,
          p: 5,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 4,
          color: "white",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            opacity: 0.4,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
          >
            {locale === "sr"
              ? "📚 Tutorijali i Vodiči"
              : "📚 Tutorials and Guides"}
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ textAlign: "center", fontSize: "1.1rem", opacity: 0.95 }}
          >
            {locale === "sr"
              ? "Kompletan sistem tutorijala za učenje kako da kreirate, prilagođavate i delite vizualizacije podataka."
              : "Complete tutorial system for learning how to create, customize, and share data visualizations."}
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", opacity: 0.9 }}
          >
            {locale === "sr"
              ? "Od početnika do naprednih korisnika - pronađite tutorial koji vam odgovara."
              : "From beginners to advanced users - find the tutorial that suits you."}
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <TutorialSearch
        tutorials={allTutorials}
        onFilteredTutorialsChange={setFilteredTutorials}
        locale={locale}
      />

      {/* Tutorials by Category */}
      {Object.entries(tutorialsByCategory).map(([category, tutorials]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
          >
            {getCategoryLabel(category, locale)}
          </Typography>
          <Grid container spacing={3}>
            {tutorials.map((tutorial) => (
              <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                <TutorialCard tutorial={tutorial} locale={locale} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Info Section */}
      <Box
        sx={{
          mt: 8,
          p: 5,
          background:
            "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)",
          borderRadius: 4,
          textAlign: "center",
          border: "2px solid",
          borderColor: "rgba(67, 233, 123, 0.2)",
          boxShadow: "0 10px 40px rgba(67, 233, 123, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}
        >
          {locale === "sr" ? "🚀 O Tutorijalima" : "🚀 About Tutorials"}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
        >
          {locale === "sr"
            ? "Tutorijali su dizajnirani da vas provedu kroz sve aspekte korišćenja Vizualni Admin platforme. Od osnovnih koncepata do naprednih tehnika, svaki tutorial sadrži praktične primere i interaktivne vežbe."
            : "Tutorials are designed to guide you through all aspects of using the Vizualni Admin platform. From basic concepts to advanced techniques, each tutorial contains practical examples and interactive exercises."}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}
        >
          {locale === "sr"
            ? "Svi tutorijali su dostupni na srpskom i engleskom jeziku, sa statičkom generacijom za optimalne performanse na GitHub Pages."
            : "All tutorials are available in Serbian and English, with static generation for optimal performance on GitHub Pages."}
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {allTutorials.length}
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontWeight: 500 }}
              >
                {locale === "sr"
                  ? "Dostupnih Tutorijala"
                  : "Available Tutorials"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(245, 87, 108, 0.3)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                5
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontWeight: 500 }}
              >
                {locale === "sr" ? "Kategorija" : "Categories"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(79, 172, 254, 0.3)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {Math.round(
                  allTutorials.reduce((sum, t) => sum + t.estimatedTime, 0) /
                    allTutorials.length
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontWeight: 500 }}
              >
                {locale === "sr" ? "Prosečno vreme (min)" : "Avg Time (min)"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DemoLayout>
  );
}

/**
 * CRITICAL: Use getStaticProps for static export (GitHub Pages compatibility)
 */
export async function getStaticProps() {
  return {
    props: {},
  };
}
