import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UsageAlert } from "@/components/UsageAlert";

vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("UsageAlert", () => {
  it("renders nothing when usage is below 80%", () => {
    const { container } = render(<UsageAlert used={7000} limit={10000} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders warning when usage is between 80% and 95%", () => {
    render(<UsageAlert used={8500} limit={10000} />);
    expect(screen.getByTestId("usage-alert")).toBeInTheDocument();
    expect(screen.getByText(/Approaching API limit/i)).toBeInTheDocument();
  });

  it("renders critical alert when usage is 95%+", () => {
    render(<UsageAlert used={9600} limit={10000} />);
    expect(screen.getByText(/API limit almost reached/i)).toBeInTheDocument();
  });

  it("shows percentage in description", () => {
    render(<UsageAlert used={8000} limit={10000} />);
    expect(screen.getByText(/80%/)).toBeInTheDocument();
  });

  it("has an upgrade link pointing to /billing", () => {
    render(<UsageAlert used={8500} limit={10000} />);
    const link = screen.getByRole("link", { name: /upgrade/i });
    expect(link).toHaveAttribute("href", "/billing");
  });

  it("dismisses when X is clicked", () => {
    render(<UsageAlert used={8500} limit={10000} />);
    fireEvent.click(screen.getByTestId("button-dismiss-usage-alert"));
    expect(screen.queryByTestId("usage-alert")).not.toBeInTheDocument();
  });
});
