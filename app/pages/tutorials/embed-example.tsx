import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Tabs, Tab, Container } from '@mui/material';
import { BarChart } from '@/components/demos/charts/BarChart';
import CodeBlock from '@/components/tutorials/CodeBlock';

// Sample data for demonstration
const sampleData = [
  { category: 'Kategorija A', value: 120 },
  { category: 'Kategorija B', value: 150 },
  { category: 'Kategorija C', value: 180 },
  { category: 'Kategorija D', value: 200 },
  { category: 'Kategorija E', value: 170 },
];

export default function EmbedExample() {
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('400');
  const [responsive, setResponsive] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Sample chart ID for demonstration
  const chartId = 'sample-bar-chart';
  const embedUrl = `/embed/${chartId}`;

  const generateEmbedCode = () => {
    const style = responsive 
      ? 'width: 100%; height: auto; min-height: 400px;' 
      : `width: ${width}px; height: ${height}px;`;
    return `<iframe src="${embedUrl}" style="${style}" frameborder="0" allowfullscreen></iframe>`;
  };

  const wordpressCode = `[iframe src="${embedUrl}" width="${width}" height="${height}"]`;

  const reactCode = `import React from 'react';

const EmbeddedChart = () => {
  return (
    <iframe
      src="${embedUrl}"
      style={{ 
        width: '${responsive ? '100%' : width + 'px'}', 
        height: '${responsive ? 'auto' : height + 'px'}', 
        minHeight: '${responsive ? '400px' : 'auto'}' 
      }}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default EmbeddedChart;`;

  const plainHtmlCode = generateEmbedCode();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Primer Ugradnje Vizualizacija
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ova stranica demonstrira kako ugraditi vizualizacije iz Vizualni Admin aplikacije na druge sajtove.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Živa Ugrađena Vizualizacija
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ovo je primer stubičastog grafikona koji možete ugraditi na svoj sajt.
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, backgroundColor: '#fafafa' }}>
          <BarChart 
            data={sampleData} 
            xKey="category" 
            yKey="value" 
            width={parseInt(width) || 800} 
            height={parseInt(height) || 400}
            xLabel="Kategorije"
            yLabel="Vrednosti"
          />
        </Box>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Kod za Ugradnju Ovog Grafikona
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Kopirajte ovaj HTML kod da biste ugradili grafikon na svoj sajt.
        </Typography>
        <CodeBlock code={plainHtmlCode} language="html" />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Generator Koda za Ugradnju
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Prilagodite dimenzije i opcije, zatim generišite kod za ugradnju.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField 
            label="Širina (px)" 
            value={width} 
            onChange={(e) => setWidth(e.target.value)} 
            type="number"
            sx={{ minWidth: 120 }}
          />
          <TextField 
            label="Visina (px)" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            type="number"
            sx={{ minWidth: 120 }}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={responsive} 
                onChange={(e) => setResponsive(e.target.checked)} 
              />
            }
            label="Responsive dizajn"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Generisani kod će se automatski ažurirati na osnovu vaših podešavanja.
        </Typography>
        <CodeBlock code={generateEmbedCode()} language="html" />
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Primeri za Različite Platforme
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Izaberite platformu na kojoj želite da ugradite vizuelizaciju.
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Čisti HTML" />
          <Tab label="WordPress" />
          <Tab label="React" />
        </Tabs>
        {tabValue === 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Za ugradnju u čisti HTML, jednostavno kopirajte iframe kod.
            </Typography>
            <CodeBlock code={plainHtmlCode} language="html" />
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Za WordPress, koristite iframe shortcode ili HTML blok.
            </Typography>
            <CodeBlock code={wordpressCode} language="html" />
          </Box>
        )}
        {tabValue === 2 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Za React aplikacije, koristite JSX komponentu.
            </Typography>
            <CodeBlock code={reactCode} language="jsx" />
          </Box>
        )}
      </Box>

      <Box sx={{ my: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Napomene
        </Typography>
        <Typography variant="body2" paragraph>
          • U produkciji, URL za ugradnju će biti dostupan nakon što se vizuelizacija sačuva.
        </Typography>
        <Typography variant="body2" paragraph>
          • Responsive opcija čini vizuelizaciju prilagodljivom različitim veličinama ekrana.
        </Typography>
        <Typography variant="body2" paragraph>
          • Uvek testirajte ugradnju na ciljnom sajtu pre objavljivanja.
        </Typography>
      </Box>
    </Container>
  );
}

/**
 * Static generation for GitHub Pages compatibility
 */
export async function getStaticProps() {
  return {
    props: {}
  };
}