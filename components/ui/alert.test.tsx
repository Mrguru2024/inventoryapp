import { render, screen } from "@testing-library/react";
import { Alert } from "./alert";

describe("Alert", () => {
  it("renders with default variant and message", () => {
    render(<Alert>Test message</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-blue-50");
    expect(alert).toHaveClass("text-blue-800");
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Alert variant="success">Success</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-green-50");
    expect(screen.getByRole("alert")).toHaveClass("text-green-800");

    rerender(<Alert variant="error">Error</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-red-50");
    expect(screen.getByRole("alert")).toHaveClass("text-red-800");

    rerender(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-yellow-50");
    expect(screen.getByRole("alert")).toHaveClass("text-yellow-800");
  });

  it("renders with icon when specified", () => {
    render(<Alert icon>With icon</Alert>);

    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<Alert className={customClass}>Test</Alert>);

    expect(screen.getByRole("alert")).toHaveClass(customClass);
  });

  it("applies dark mode styles", () => {
    render(<Alert darkMode>Test</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("dark:bg-blue-900");
    expect(alert).toHaveClass("dark:text-blue-200");
  });

  it("renders with title when provided", () => {
    render(<Alert title="Alert Title">Test message</Alert>);

    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("handles dismissible alerts", () => {
    const onDismiss = jest.fn();
    render(<Alert onDismiss={onDismiss}>Dismissible</Alert>);

    const dismissButton = screen.getByRole("button", { name: /dismiss/i });
    expect(dismissButton).toBeInTheDocument();

    dismissButton.click();
    expect(onDismiss).toHaveBeenCalled();
  });
});
