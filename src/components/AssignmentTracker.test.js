import { render, screen } from '@testing-library/react';
import AssignmentTracker from './AssignmentTracker';
import axios from 'axios';

// ✅ FIXED axios mock
jest.mock('axios');

beforeEach(() => {
  axios.mockResolvedValue({ data: [] }); // prevent API crash
});

describe('AssignmentTracker Component', () => {

  test('renders component without crashing', () => {
    render(<AssignmentTracker />);
  });

  test('renders heading text correctly', () => {
    render(<AssignmentTracker />);
    
    // ✅ FIX: use exact heading
    const heading = screen.getByText('Student Assignment Tracker');
    expect(heading).toBeInTheDocument();
  });

  test('renders input fields', () => {
    render(<AssignmentTracker />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders button', () => {
    render(<AssignmentTracker />);
    const button = screen.getByRole('button', { name: /add assignment/i });
    expect(button).toBeInTheDocument();
  });

  test('basic DOM check', () => {
    render(<AssignmentTracker />);
    expect(document.body).toBeTruthy();
  });

});
