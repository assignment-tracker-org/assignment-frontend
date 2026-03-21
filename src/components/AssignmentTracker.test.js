import { render, screen } from "@testing-library/react";
import AssignmentTracker from "./AssignmentTracker";
import axios from "axios";

// ✅ Proper axios mock for CRA + Jest
jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  axios.mockResolvedValue({ data: [] });
});

describe("AssignmentTracker Component", () => {
  test("renders component without crashing", () => {
    render(<AssignmentTracker />);
  });

  test("renders heading text", () => {
    render(<AssignmentTracker />);
    const text = screen.getByText(/student assignment tracker/i); // ✅ FIXED
    expect(text).toBeInTheDocument();
  });

  test("renders input fields", () => {
    render(<AssignmentTracker />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0);
  });

  test("renders button", () => {
    render(<AssignmentTracker />);
    const button = screen.getByRole("button", { name: /add assignment/i });
    expect(button).toBeInTheDocument();
  });

  test("basic DOM check", () => {
    render(<AssignmentTracker />);
    expect(document.body).toBeTruthy();
  });
});
