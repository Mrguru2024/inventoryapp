import { render, screen } from "@testing-library/react";
import ReqStatusBadge from "./index";

describe("ReqStatusBadge", () => {
  const statusConfig = {
    pending: {
      label: "Pending",
      color: "yellow",
      icon: "clock",
    },
    approved: {
      label: "Approved",
      color: "green",
      icon: "check",
    },
    denied: {
      label: "Denied",
      color: "red",
      icon: "xmark",
    },
    fulfilled: {
      label: "Fulfilled",
      color: "blue",
      icon: "box",
    },
  };

  it("renders correct status label", () => {
    render(<ReqStatusBadge status="pending" />);
    expect(screen.getByText(statusConfig.pending.label)).toBeInTheDocument();
  });

  it("applies correct color classes for each status", () => {
    const { rerender } = render(<ReqStatusBadge status="pending" />);
    expect(screen.getByTestId("status-badge")).toHaveClass("bg-yellow-100");
    expect(screen.getByTestId("status-badge")).toHaveClass("text-yellow-800");

    rerender(<ReqStatusBadge status="approved" />);
    expect(screen.getByTestId("status-badge")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("status-badge")).toHaveClass("text-green-800");

    rerender(<ReqStatusBadge status="denied" />);
    expect(screen.getByTestId("status-badge")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("status-badge")).toHaveClass("text-red-800");

    rerender(<ReqStatusBadge status="fulfilled" />);
    expect(screen.getByTestId("status-badge")).toHaveClass("bg-blue-100");
    expect(screen.getByTestId("status-badge")).toHaveClass("text-blue-800");
  });

  it("displays correct icon for each status", () => {
    const { rerender } = render(<ReqStatusBadge status="pending" />);
    expect(screen.getByTestId("status-icon")).toHaveClass("fa-clock");

    rerender(<ReqStatusBadge status="approved" />);
    expect(screen.getByTestId("status-icon")).toHaveClass("fa-check");

    rerender(<ReqStatusBadge status="denied" />);
    expect(screen.getByTestId("status-icon")).toHaveClass("fa-xmark");

    rerender(<ReqStatusBadge status="fulfilled" />);
    expect(screen.getByTestId("status-icon")).toHaveClass("fa-box");
  });

  it("applies dark mode styles correctly", () => {
    render(<ReqStatusBadge status="pending" darkMode />);
    const badge = screen.getByTestId("status-badge");

    expect(badge).toHaveClass("dark:bg-yellow-900");
    expect(badge).toHaveClass("dark:text-yellow-200");
  });

  it("handles custom className prop", () => {
    const customClass = "custom-class";
    render(<ReqStatusBadge status="pending" className={customClass} />);

    expect(screen.getByTestId("status-badge")).toHaveClass(customClass);
  });

  it("displays tooltip on hover when provided", () => {
    const tooltip = "Awaiting manager approval";
    render(<ReqStatusBadge status="pending" tooltip={tooltip} />);

    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveAttribute("title", tooltip);
  });
});
