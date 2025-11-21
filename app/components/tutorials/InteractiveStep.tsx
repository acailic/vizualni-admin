import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { ContentCopy, CheckCircle, Error, Lightbulb, Warning } from '@mui/icons-material';
import { SimpleChart } from '../demos/simple-chart';

interface BaseStep {
  title?: string;
  tips?: string[];
  warnings?: string[];
}

interface InstructionStep extends BaseStep {
  type: 'instruction';
  text: string;
}

interface CodeStep extends BaseStep {
  type: 'code';
  code: string;
  language: string;
  filename?: string;
}

interface DemoStep extends BaseStep {
  type: 'demo';
  chartType: 'line' | 'bar' | 'column' | 'area' | 'pie' | 'map' | 'scatterplot';
  data: any[];
  xKey?: string;
  yKey?: string;
}

interface ExerciseStep extends BaseStep {
  type: 'exercise';
  description: string;
  action: 'click' | 'input';
  expected?: string;
  validation?: (input: string) => boolean;
}

interface QuizStep extends BaseStep {
  type: 'quiz';
  question: string;
  options: string[];
  correct: number;
}

type Step = InstructionStep | CodeStep | DemoStep | ExerciseStep | QuizStep;

interface InteractiveStepProps {
  step: Step;
  onComplete?: () => void;
}

export function InteractiveStep({ step, onComplete }: InteractiveStepProps) {
  const [exerciseInput, setExerciseInput] = useState('');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleExerciseSubmit = () => {
    if (step.type === 'exercise') {
      const isValid = step.validation ? step.validation(exerciseInput) : exerciseInput === step.expected;
      if (isValid) {
        setExerciseCompleted(true);
        onComplete?.();
      }
    }
  };

  const handleQuizSubmit = () => {
    if (step.type === 'quiz' && quizAnswer !== null) {
      const isCorrect = quizAnswer === step.correct;
      if (isCorrect) {
        setQuizCompleted(true);
        onComplete?.();
      }
    }
  };

  const renderTipsAndWarnings = (tips?: string[], warnings?: string[]) => (
    <>
      {tips && tips.map((tip, i) => (
        <Alert key={`tip-${i}`} severity="info" icon={<Lightbulb />} sx={{ mb: 2 }}>
          {tip}
        </Alert>
      ))}
      {warnings && warnings.map((warning, i) => (
        <Alert key={`warning-${i}`} severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
          {warning}
        </Alert>
      ))}
    </>
  );

  const renderContent = () => {
    switch (step.type) {
      case 'instruction':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              {step.text}
            </Typography>
            {renderTipsAndWarnings(step.tips, step.warnings)}
          </Box>
        );

      case 'code':
        return (
          <Box>
            {step.filename && (
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                {step.filename}
              </Typography>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                position: 'relative',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflow: 'auto',
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleCopyCode(step.code)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
              >
                {copied ? <CheckCircle color="success" /> : <ContentCopy />}
              </IconButton>
              <Chip
                label={step.language}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                }}
              />
              <pre style={{ margin: 0, marginTop: 40, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {step.code}
              </pre>
            </Paper>
            {renderTipsAndWarnings(step.tips, step.warnings)}
          </Box>
        );

      case 'demo':
        return (
          <Box>
            <SimpleChart
              data={step.data}
              chartType={step.chartType}
              xKey={step.xKey}
              yKey={step.yKey}
              width={600}
              height={400}
            />
            {renderTipsAndWarnings(step.tips, step.warnings)}
          </Box>
        );

      case 'exercise':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {step.description}
            </Typography>
            {step.action === 'click' ? (
              <Button
                variant="contained"
                onClick={handleExerciseSubmit}
                disabled={exerciseCompleted}
                sx={{ mb: 2 }}
              >
                {exerciseCompleted ? 'Completed!' : 'Complete Exercise'}
              </Button>
            ) : (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                  placeholder="Enter your answer..."
                  disabled={exerciseCompleted}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleExerciseSubmit}
                  disabled={exerciseCompleted || !exerciseInput.trim()}
                >
                  Submit
                </Button>
              </Box>
            )}
            {exerciseCompleted && (
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Exercise completed successfully!
              </Alert>
            )}
            {renderTipsAndWarnings(step.tips, step.warnings)}
          </Box>
        );

      case 'quiz':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {step.question}
            </Typography>
            <RadioGroup
              value={quizAnswer}
              onChange={(e) => setQuizAnswer(parseInt(e.target.value))}
              sx={{ mb: 2 }}
            >
              {step.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  value={i}
                  control={<Radio />}
                  label={option}
                  disabled={quizCompleted}
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              onClick={handleQuizSubmit}
              disabled={quizCompleted || quizAnswer === null}
              sx={{ mb: 2 }}
            >
              Submit Answer
            </Button>
            {quizCompleted && (
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Correct answer!
              </Alert>
            )}
            {renderTipsAndWarnings(step.tips, step.warnings)}
          </Box>
        );

      default:
        return <Typography>Unsupported step type</Typography>;
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
      {step.title && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {step.title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      {renderContent()}
    </Paper>
  );
}