Tutorial Config → Static Generation → Tutorial Page → Layout → Interactive Steps → Progress Tracking
```

### File Structure

```
app/
├── lib/tutorials/
│   ├── config.ts          # Tutorial configurations
│   └── index.ts           # Exports
├── components/tutorials/
│   ├── TutorialLayout.tsx # Main layout
│   ├── InteractiveStep.tsx # Step rendering
│   ├── CodeBlock.tsx      # Code display
│   ├── TutorialCard.tsx   # Tutorial cards
│   └── index.ts           # Exports
├── hooks/
│   └── useTutorialProgress.ts # Progress management
├── pages/tutorials/
│   ├── index.tsx          # Tutorial listing
│   └── [slug].tsx         # Individual tutorials
└── docs/catalog/
    └── tutorials-overview.mdx # Documentation
```

## Adding New Tutorials

### Step 1: Define Tutorial Configuration

Add your tutorial to `app/lib/tutorials/config.ts`:

```typescript
// In the appropriate category array
{
  id: 'my-new-tutorial',
  title: {
    sr: 'Moj novi tutorial',
    en: 'My New Tutorial'
  },
  description: {
    sr: 'Opis na srpskom jeziku',
    en: 'Description in English'
  },
  category: 'getting-started', // or 'creating-charts', 'embedding', 'api-usage', 'advanced'
  difficulty: 'beginner', // 'intermediate' or 'advanced'
  estimatedTime: 20, // minutes
  icon: '🎯', // emoji or icon identifier
  tags: ['tag1', 'tag2'],
  steps: [
    // Define steps here
  ]
}
```

### Step 2: Implement Tutorial Steps

Each step is defined with the following structure:

```typescript
{
  id: 'step-id',
  title: {
    sr: 'Naslov koraka',
    en: 'Step Title'
  },
  type: 'instruction', // 'instruction', 'code', 'demo', 'exercise', 'quiz'
  content: {
    sr: 'Sadržaj na srpskom',
    en: 'Content in English'
  },
  // Optional fields based on type
  code: 'console.log("example");', // for code type
  demoId: 'demo-slug', // for demo type
  exercisePrompt: {
    sr: 'Prompt na srpskom',
    en: 'Exercise prompt'
  },
  quizQuestions: [
    {
      question: { sr: 'Pitanje?', en: 'Question?' },
      options: [
        { sr: 'Opcija 1', en: 'Option 1' },
        { sr: 'Opcija 2', en: 'Option 2' }
      ],
      correctIndex: 0
    }
  ]
}
```

### Step 3: Update Exports

Ensure your tutorial is exported from `app/lib/tutorials/index.ts`:

```typescript
export { TUTORIAL_CONFIGS, getTutorialConfig, getAllTutorialIds } from './config';
```

### Step 4: Test and Build

Run the development server to test:

```bash
yarn dev
```

Visit `http://localhost:3000/tutorials` to see your new tutorial.

Build static pages:

```bash
yarn build:static
```

## Configuration Format

### TutorialConfig Interface

```typescript
interface TutorialConfig {
  id: string;                    // Unique identifier
  title: BilingualText;          // Tutorial title
  description: BilingualText;    // Short description
  category: TutorialCategory;    // Organization category
  difficulty: DifficultyLevel;   // 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number;         // Time in minutes
  icon: string;                  // Display icon (emoji)
  tags: string[];                // Search/filter tags
  steps: TutorialStep[];         // Step definitions
}

interface BilingualText {
  sr: string;  // Serbian text
  en: string;  // English text
}

type TutorialCategory = 'getting-started' | 'creating-charts' | 'embedding' | 'api-usage' | 'advanced';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
```

### TutorialStep Interface

```typescript
interface TutorialStep {
  id: string;                    // Unique step identifier
  title: BilingualText;          // Step title
  type: StepType;                // Content type
  content: BilingualText;        // Main content (markdown supported)
  code?: string;                 // Code snippet (for 'code' type)
  demoId?: string;               // Demo identifier (for 'demo' type)
  exercisePrompt?: BilingualText; // Exercise instructions
  quizQuestions?: QuizQuestion[]; // Quiz content
}

type StepType = 'instruction' | 'code' | 'demo' | 'exercise' | 'quiz';

interface QuizQuestion {
  question: BilingualText;
  options: BilingualText[];
  correctIndex: number;
}
```

## Creating Interactive Steps

### Step Types

#### Instruction Steps
Basic text content with markdown support:

```typescript
{
  type: 'instruction',
  content: {
    sr: 'Kliknite na dugme **Dalje** da nastavite.',
    en: 'Click the **Next** button to continue.'
  }
}
```

#### Code Steps
Display syntax-highlighted code with copy functionality:

```typescript
{
  type: 'code',
  content: {
    sr: 'Kopirajte ovaj kod u svoju aplikaciju:',
    en: 'Copy this code into your application:'
  },
  code: `const chart = new ChartVisualizer({
  data: myData,
  chartType: 'bar'
});`
}
```

#### Demo Steps
Embed live visualizations from the demo gallery:

```typescript
{
  type: 'demo',
  content: {
    sr: 'Pogledajte kako izgleda gotova vizualizacija:',
    en: 'See how the finished visualization looks:'
  },
  demoId: 'budget'  // References demo from DEMO_CONFIGS
}
```

#### Exercise Steps
Interactive tasks with validation:

```typescript
{
  type: 'exercise',
  content: {
    sr: 'Kreirajte bar grafikon sa podacima o budžetu.',
    en: 'Create a bar chart with budget data.'
  },
  exercisePrompt: {
    sr: 'Koristite ChartVisualizer komponentu...',
    en: 'Use the ChartVisualizer component...'
  }
}
```

#### Quiz Steps
Multiple-choice questions for knowledge checks:

```typescript
{
  type: 'quiz',
  content: {
    sr: 'Proverite svoje znanje:',
    en: 'Test your knowledge:'
  },
  quizQuestions: [
    {
      question: {
        sr: 'Koji tip grafikona je najbolji za prikazivanje trendova tokom vremena?',
        en: 'Which chart type is best for showing trends over time?'
      },
      options: [
        { sr: 'Bar grafikon', en: 'Bar chart' },
        { sr: 'Linijski grafikon', en: 'Line chart' },
        { sr: 'Pie grafikon', en: 'Pie chart' }
      ],
      correctIndex: 1
    }
  ]
}
```

### Content Guidelines

- Use clear, concise language
- Include actionable instructions
- Provide context for why steps are important
- Use markdown for formatting (bold, italic, lists, links)
- Keep steps focused on single concepts
- Include examples and screenshots where helpful

## Best Practices

### Writing Tutorials

1. **Start Simple**: Begin with basic concepts and build complexity
2. **Progressive Disclosure**: Reveal information gradually
3. **Active Learning**: Include exercises and quizzes
4. **Real Examples**: Use actual data.gov.rs datasets
5. **Bilingual Support**: Ensure Serbian and English content are equivalent
6. **Accessibility**: Write clear, simple language
7. **Modular Steps**: Each step should be completable in 2-5 minutes

### Technical Best Practices

1. **Consistent IDs**: Use kebab-case for tutorial and step IDs
2. **Icon Selection**: Choose relevant emojis that work across platforms
3. **Tag Strategy**: Include both technical and user-friendly tags
4. **Time Estimates**: Base estimates on testing with actual users
5. **Difficulty Levels**: 
   - Beginner: No prior knowledge required
   - Intermediate: Basic familiarity assumed
   - Advanced: Deep understanding needed

### Content Organization

1. **Logical Flow**: Steps should follow a natural learning progression
2. **Prerequisites**: Clearly state what users should know before starting
3. **Next Steps**: Suggest related tutorials or resources
4. **Error Handling**: Anticipate common mistakes and provide guidance
5. **Success Metrics**: Define what users will accomplish

## Testing Tutorials

### Manual Testing Checklist

- [ ] Tutorial loads correctly on all devices
- [ ] Navigation between steps works
- [ ] Progress tracking updates properly
- [ ] Code examples are syntactically correct
- [ ] Demo embeds display correctly
- [ ] Quiz questions have correct answers
- [ ] Bilingual content displays appropriately
- [ ] Links and references work
- [ ] Time estimates are accurate

### Automated Testing

Add tests in `app/__tests__/tutorials/`:

```typescript
// tutorials.test.ts
import { getTutorialConfig, getAllTutorialIds } from '../lib/tutorials';

describe('Tutorial System', () => {
  test('all tutorials have valid configurations', () => {
    const ids = getAllTutorialIds();
    ids.forEach(id => {
      const config = getTutorialConfig(id);
      expect(config).toBeTruthy();
      expect(config?.steps.length).toBeGreaterThan(0);
    });
  });

  test('tutorial steps have required fields', () => {
    // Test step validation
  });
});
```

### User Testing

1. **Usability Testing**: Have users complete tutorials and provide feedback
2. **A/B Testing**: Test different approaches to complex topics
3. **Accessibility Testing**: Ensure screen reader compatibility
4. **Performance Testing**: Verify loading times and responsiveness

## Maintaining Tutorials

### Regular Maintenance Tasks

1. **Content Updates**: Keep examples current with latest features
2. **API Changes**: Update references when data.gov.rs API changes
3. **Broken Links**: Regularly check all external links
4. **User Feedback**: Incorporate suggestions from users
5. **Translation Quality**: Review and improve bilingual content

### Version Control

1. **Semantic Versioning**: Use version numbers for significant updates
2. **Changelog**: Document changes in tutorial content
3. **Deprecation**: Mark outdated tutorials clearly
4. **Archiving**: Move completed tutorials to archive section

### Analytics and Metrics

Track tutorial usage to identify:
- Most/least popular tutorials
- Drop-off points (where users stop)
- Quiz failure rates
- Completion rates by difficulty level

### Contributor Guidelines

1. **Pull Request Template**: Require tutorial additions to include:
   - Rationale for new tutorial
   - Target audience
   - Testing results
   - Bilingual content review

2. **Code Review Checklist**:
   - Configuration follows interface
   - Content is accurate and clear
   - Steps are appropriately sized
   - Bilingual parity maintained

## Examples

### Complete Tutorial Configuration

```typescript
{
  id: 'creating-bar-charts',
  title: {
    sr: 'Kreiranje bar grafikona',
    en: 'Creating Bar Charts'
  },
  description: {
    sr: 'Korak-po-korak vodič za kreiranje bar grafikona.',
    en: 'Step-by-step guide to creating bar charts.'
  },
  category: 'creating-charts',
  difficulty: 'beginner',
  estimatedTime: 15,
  icon: '📏',
  tags: ['bar', 'grafikon', 'kreiranje'],
  steps: [
    {
      id: 'introduction',
      title: {
        sr: 'Uvod u bar grafikone',
        en: 'Introduction to Bar Charts'
      },
      type: 'instruction',
      content: {
        sr: 'Bar grafikoni su odlični za poređenje vrednosti između različitih kategorija.',
        en: 'Bar charts are excellent for comparing values across different categories.'
      }
    },
    {
      id: 'select-data',
      title: {
        sr: 'Izbor podataka',
        en: 'Selecting Data'
      },
      type: 'instruction',
      content: {
        sr: 'Izaberite skup podataka koji ima kategorije i numeričke vrednosti.',
        en: 'Select a dataset that has categories and numeric values.'
      }
    },
    {
      id: 'code-example',
      title: {
        sr: 'Primer koda',
        en: 'Code Example'
      },
      type: 'code',
      content: {
        sr: 'Koristite sledeći kod da kreirate bar grafikon:',
        en: 'Use the following code to create a bar chart:'
      },
      code: `import { BarChart } from '@/components/demos/charts';

<BarChart
  data={data}
  xKey="category"
  yKey="value"
  title="My Bar Chart"
/>`
    },
    {
      id: 'live-demo',
      title: {
        sr: 'Živi primer',
        en: 'Live Example'
      },
      type: 'demo',
      content: {
        sr: 'Pogledajte kako izgleda gotov bar grafikon:',
        en: 'See how a finished bar chart looks:'
      },
      demoId: 'budget'
    },
    {
      id: 'exercise',
      title: {
        sr: 'Vežba',
        en: 'Exercise'
      },
      type: 'exercise',
      content: {
        sr: 'Kreirajte bar grafikon sa podacima o broju stanovnika po gradovima.',
        en: 'Create a bar chart with population data by cities.'
      },
      exercisePrompt: {
        sr: 'Koristite podatke iz demo galerije i prilagodite xKey i yKey.',
        en: 'Use data from the demo gallery and adjust xKey and yKey.'
      }
    },
    {
      id: 'quiz',
      title: {
        sr: 'Provera znanja',
        en: 'Knowledge Check'
      },
      type: 'quiz',
      content: {
        sr: 'Da li ste razumeli koncepte?',
        en: 'Did you understand the concepts?'
      },
      quizQuestions: [
        {
          question: {
            sr: 'Šta je xKey u bar grafikonu?',
            en: 'What is xKey in a bar chart?'
          },
          options: [
            { sr: 'Vertikalna osa', en: 'Vertical axis' },
            { sr: 'Horizontalna osa', en: 'Horizontal axis' },
            { sr: 'Boja grafikona', en: 'Chart color' }
          ],
          correctIndex: 1
        }
      ]
    }
  ]
}
```

### Step Implementation Example

```typescript
// In InteractiveStep.tsx
function renderStepContent(step: TutorialStep) {
  switch (step.type) {
    case 'instruction':
      return <Markdown content={step.content} />;
    
    case 'code':
      return (
        <Box>
          <Markdown content={step.content} />
          <CodeBlock code={step.code} language="typescript" />
        </Box>
      );
    
    case 'demo':
      return (
        <Box>
          <Markdown content={step.content} />
          <DemoEmbed demoId={step.demoId} />
        </Box>
      );
    
    // ... other types
  }
}