import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssessmentStepper from './AssessmentStepper';
import type { Question } from '@/types/assessment';

const mockQuestions: Question[] = [
  {
    id: 'Q1',
    domain: 'identity',
    prompt: 'Do you have clarity about your values and purpose?',
  },
  {
    id: 'Q2',
    domain: 'identity',
    prompt: 'Do your daily actions align with your core identity?',
  },
  {
    id: 'Q3',
    domain: 'health',
    prompt: 'How would you rate your overall physical health?',
  },
];

describe('AssessmentStepper Component', () => {
  describe('Rendering', () => {
    it('should render the first question on initial load', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      expect(screen.getByText('Do you have clarity about your values and purpose?')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    });

    it('should render all 5 answer options', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      expect(screen.getByText('Never / Very Low')).toBeInTheDocument();
      expect(screen.getByText('Rarely')).toBeInTheDocument();
      expect(screen.getByText('Sometimes')).toBeInTheDocument();
      expect(screen.getByText('Often')).toBeInTheDocument();
      expect(screen.getByText('Always / Excellent')).toBeInTheDocument();
    });

    it('should show correct progress percentage', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Question 1 of 3 = 33%
      expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('should disable Previous button on first question', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      const previousButton = screen.getByRole('button', { name: /previous/i });
      expect(previousButton).toBeDisabled();
    });

    it('should disable Next button when no answer is selected', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      const nextButton = screen.getByRole('button', { name: /next question/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Answer Selection', () => {
    it('should update UI when an answer is selected', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      const option3 = screen.getByRole('button', { name: /3 Sometimes/i });
      await user.click(option3);

      // Should show checkmark on selected option (check for selected styling)
      expect(option3).toHaveClass('border-blue-500');
    });

    it('should enable Next button after selecting an answer', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      const nextButton = screen.getByRole('button', { name: /next question/i });
      expect(nextButton).toBeDisabled();

      const option4 = screen.getByRole('button', { name: /4 Often/i });
      await user.click(option4);

      expect(nextButton).not.toBeDisabled();
    });

    it('should allow changing answer selection', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Select option 3
      const option3 = screen.getByRole('button', { name: /3 Sometimes/i });
      await user.click(option3);

      // Change to option 5
      const option5 = screen.getByRole('button', { name: /5 Always/i });
      await user.click(option5);

      // Option 5 should be selected
      expect(option5).toHaveClass('border-blue-500');
    });
  });

  describe('Navigation', () => {
    it('should advance to next question when Next is clicked', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer first question
      const option3 = screen.getByRole('button', { name: /3 Sometimes/i });
      await user.click(option3);

      // Click Next
      const nextButton = screen.getByRole('button', { name: /next question/i });
      await user.click(nextButton);

      // Wait for animation and should show second question
      await waitFor(() => {
        expect(screen.getByText('Do your daily actions align with your core identity?')).toBeInTheDocument();
      });
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
    });

    it('should go back to previous question when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer and advance to Q2
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Click Previous
      const previousButton = screen.getByRole('button', { name: /previous/i });
      await user.click(previousButton);

      // Should show first question again
      expect(screen.getByText('Do you have clarity about your values and purpose?')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    });

    it('should preserve answers when navigating back', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer Q1 with option 4
      await user.click(screen.getByRole('button', { name: /4 Often/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Go back to Q1
      await user.click(screen.getByRole('button', { name: /previous/i }));

      // Option 4 should still be selected
      const option4 = screen.getByRole('button', { name: /4 Often/i });
      expect(option4).toHaveClass('border-blue-500');
    });

    it('should enable Previous button after advancing', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer and advance
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      const previousButton = screen.getByRole('button', { name: /previous/i });
      expect(previousButton).not.toBeDisabled();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should select answer with number keys 1-5', async () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Press key "3"
      fireEvent.keyDown(window, { key: '3' });

      await waitFor(() => {
        const option3 = screen.getByRole('button', { name: /3 Sometimes/i });
        expect(option3).toHaveClass('border-blue-500');
      });
    });

    it('should navigate to previous question with ArrowLeft', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer and advance to Q2
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Press ArrowLeft
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText('Do you have clarity about your values and purpose?')).toBeInTheDocument();
      });
    });

    it('should navigate to next question with ArrowRight', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer question with keyboard
      fireEvent.keyDown(window, { key: '4' });

      // Wait for answer to register
      await waitFor(() => {
        const option4 = screen.getByRole('button', { name: /4 Often/i });
        expect(option4).toHaveClass('border-blue-500');
      });

      // Press ArrowRight
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('Do your daily actions align with your core identity?')).toBeInTheDocument();
      });
    });

    it('should navigate to next question with Enter key', async () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer with keyboard
      fireEvent.keyDown(window, { key: '5' });

      // Wait for answer
      await waitFor(() => {
        const option5 = screen.getByRole('button', { name: /5 Always/i });
        expect(option5).toHaveClass('border-blue-500');
      });

      // Press Enter
      fireEvent.keyDown(window, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Do your daily actions align with your core identity?')).toBeInTheDocument();
      });
    });

    it('should not navigate with ArrowRight if no answer selected', () => {
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      const firstQuestion = screen.getByText('Do you have clarity about your values and purpose?');

      // Press ArrowRight without answering
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Should still be on first question
      expect(firstQuestion).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onComplete when last question is answered and submitted', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer all three questions
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      await user.click(screen.getByRole('button', { name: /4 Often/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      await user.click(screen.getByRole('button', { name: /5 Always/i }));

      // Last question should show "Complete Assessment"
      const completeButton = screen.getByRole('button', { name: /complete assessment/i });
      await user.click(completeButton);

      // Should call onComplete with all answers
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith({
        Q1: 3,
        Q2: 4,
        Q3: 5,
      });
    });

    it('should show "Complete Assessment" button on last question', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Navigate to last question
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));
      await user.click(screen.getByRole('button', { name: /4 Often/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Should show Complete Assessment button
      expect(screen.getByRole('button', { name: /complete assessment/i })).toBeInTheDocument();
    });

    it('should include all answers when completing assessment', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Answer with specific values
      await user.click(screen.getByRole('button', { name: /1 Never/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      await user.click(screen.getByRole('button', { name: /2 Rarely/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      await user.click(screen.getByRole('button', { name: /5 Always/i }));
      await user.click(screen.getByRole('button', { name: /complete assessment/i }));

      expect(onComplete).toHaveBeenCalledWith({
        Q1: 1,
        Q2: 2,
        Q3: 5,
      });
    });
  });

  describe('Progress Tracking', () => {
    it('should update progress bar as user advances', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<AssessmentStepper questions={mockQuestions} onComplete={onComplete} />);

      // Q1: 33%
      expect(screen.getByText('33%')).toBeInTheDocument();

      // Advance to Q2
      await user.click(screen.getByRole('button', { name: /3 Sometimes/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Q2: 67%
      expect(screen.getByText('67%')).toBeInTheDocument();

      // Advance to Q3
      await user.click(screen.getByRole('button', { name: /4 Often/i }));
      await user.click(screen.getByRole('button', { name: /next question/i }));

      // Q3: 100%
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className prop', () => {
      const onComplete = vi.fn();
      const { container } = render(
        <AssessmentStepper
          questions={mockQuestions}
          onComplete={onComplete}
          className="custom-test-class"
        />
      );

      const stepperDiv = container.querySelector('.custom-test-class');
      expect(stepperDiv).toBeInTheDocument();
    });
  });
});
