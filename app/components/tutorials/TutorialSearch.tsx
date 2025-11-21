import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { TutorialConfig } from '../../lib/tutorials/config';

interface TutorialSearchProps {
  tutorials: TutorialConfig[];
  onFilteredTutorialsChange: (filtered: TutorialConfig[]) => void;
}

const TutorialSearch: React.FC<TutorialSearchProps> = ({
  tutorials,
  onFilteredTutorialsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    const filtered = tutorials.filter((tutorial) => {
      const matchesSearch =
        searchTerm === '' ||
        tutorial.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.title.sr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.sr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || tutorial.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    onFilteredTutorialsChange(filtered);
  }, [searchTerm, categoryFilter, difficultyFilter, tutorials, onFilteredTutorialsChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDifficultyFilter('all');
  };

  const filteredCount = tutorials.filter((tutorial) => {
    const matchesSearch =
      searchTerm === '' ||
      tutorial.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.title.sr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.sr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || tutorial.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }).length;

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search tutorials"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="getting-started">Getting Started</MenuItem>
              <MenuItem value="creating-charts">Creating Charts</MenuItem>
              <MenuItem value="embedding">Embedding</MenuItem>
              <MenuItem value="api-usage">API Usage</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficultyFilter}
              label="Difficulty"
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ height: '56px' }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {filteredCount} tutorial{filteredCount !== 1 ? 's' : ''} found
      </Typography>
    </Box>
  );
};

export default TutorialSearch;