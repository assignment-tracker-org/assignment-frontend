import { render, screen } from '@testing-library/react';
import AssignmentTracker from './AssignmentTracker';

describe('AssignmentTracker Component', () => {

  test('renders component without crashing', () => {
    render(<AssignmentTracker />);
  });

  test('renders heading text', () => {
    render(<AssignmentTracker />);
    const text = screen.getByText(/assignment/i);
    expect(text).toBeInTheDocument();
  });

  test('renders input fields', () => {
    render(<AssignmentTracker />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders button', () => {
    render(<AssignmentTracker />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('basic DOM check', () => {
    render(<AssignmentTracker />);
    expect(document.body).toBeTruthy();
  });

});
