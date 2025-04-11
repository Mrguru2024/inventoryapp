import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with default variant and children", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveClass("text-white");
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-600");
    expect(screen.getByRole("button")).toHaveClass("text-white");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");
    expect(screen.getByRole("button")).toHaveClass("border-gray-300");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-gray-100");
  });

  it("handles click events", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-2");
    expect(screen.getByRole("button")).toHaveClass("py-1");
    expect(screen.getByRole("button")).toHaveClass("text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6");
    expect(screen.getByRole("button")).toHaveClass("py-3");
    expect(screen.getByRole("button")).toHaveClass("text-lg");
  });

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("applies loading state correctly", () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("applies dark mode styles", () => {
    render(<Button darkMode>Dark Mode</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("dark:bg-blue-500");
    expect(button).toHaveClass("dark:hover:bg-blue-600");
  });

  it("renders with icon when specified", () => {
    render(
      <Button icon={<span data-testid="test-icon">Icon</span>}>
        With Icon
      </Button>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<Button className={customClass}>Custom</Button>);

    expect(screen.getByRole("button")).toHaveClass(customClass);
  });
});
