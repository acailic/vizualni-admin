import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { TutorialConfig } from "../../lib/tutorials/config";

interface TutorialSearchProps {
  tutorials: TutorialConfig[];
  onFilteredTutorialsChange: (filtered: TutorialConfig[]) => void;
  locale: "sr" | "en";
}

const TutorialSearch: React.FC<TutorialSearchProps> = ({
  tutorials,
  onFilteredTutorialsChange,
  locale,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    const filtered = tutorials.filter((tutorial) => {
      const matchesSearch =
        searchTerm === "" ||
        tutorial.title[locale]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tutorial.description[locale]
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tutorial.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || tutorial.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || tutorial.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    onFilteredTutorialsChange(filtered);
  }, [
    searchTerm,
    categoryFilter,
    difficultyFilter,
    tutorials,
    onFilteredTutorialsChange,
    locale,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setDifficultyFilter("all");
  };

  const filteredCount = tutorials.filter((tutorial) => {
    const matchesSearch =
      searchTerm === "" ||
      tutorial.title[locale].toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description[locale]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tutorial.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || tutorial.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || tutorial.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }).length;

  const getCategoryLabel = (category: string) => {
    const labels = {
      "getting-started": { sr: "Početak", en: "Getting Started" },
      "creating-charts": { sr: "Kreiranje Grafikona", en: "Creating Charts" },
      embedding: { sr: "Ugrađivanje", en: "Embedding" },
      "api-usage": { sr: "Korišćenje API-ja", en: "API Usage" },
      advanced: { sr: "Napredno", en: "Advanced" },
    };
    return labels[category as keyof typeof labels]?.[locale] || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: { sr: "Početnik", en: "Beginner" },
      intermediate: { sr: "Srednji", en: "Intermediate" },
      advanced: { sr: "Napredni", en: "Advanced" },
    };
    return labels[difficulty as keyof typeof labels]?.[locale] || difficulty;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={locale === "sr" ? "Pretraži tutorijale" : "Search tutorials"}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              locale === "sr"
                ? "Pretraži po naslovu ili opisu"
                : "Search by title or description"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>
              {locale === "sr" ? "Kategorija" : "Category"}
            </InputLabel>
            <Select
              value={categoryFilter}
              label={locale === "sr" ? "Kategorija" : "Category"}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">{locale === "sr" ? "Sve" : "All"}</MenuItem>
              <MenuItem value="getting-started">
                {getCategoryLabel("getting-started")}
              </MenuItem>
              <MenuItem value="creating-charts">
                {getCategoryLabel("creating-charts")}
              </MenuItem>
              <MenuItem value="embedding">
                {getCategoryLabel("embedding")}
              </MenuItem>
              <MenuItem value="api-usage">
                {getCategoryLabel("api-usage")}
              </MenuItem>
              <MenuItem value="advanced">
                {getCategoryLabel("advanced")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>{locale === "sr" ? "Težina" : "Difficulty"}</InputLabel>
            <Select
              value={difficultyFilter}
              label={locale === "sr" ? "Težina" : "Difficulty"}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <MenuItem value="all">{locale === "sr" ? "Sve" : "All"}</MenuItem>
              <MenuItem value="beginner">
                {getDifficultyLabel("beginner")}
              </MenuItem>
              <MenuItem value="intermediate">
                {getDifficultyLabel("intermediate")}
              </MenuItem>
              <MenuItem value="advanced">
                {getDifficultyLabel("advanced")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ height: "56px" }}
          >
            {locale === "sr" ? "Obriši filtere" : "Clear Filters"}
          </Button>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {locale === "sr"
          ? `${filteredCount} tutorijal${filteredCount !== 1 ? "a" : ""} pronađen${filteredCount !== 1 ? "o" : ""}`
          : `${filteredCount} tutorial${filteredCount !== 1 ? "s" : ""} found`}
      </Typography>
    </Box>
  );
};

export default TutorialSearch;
