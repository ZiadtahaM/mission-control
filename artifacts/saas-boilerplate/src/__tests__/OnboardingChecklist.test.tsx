import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";

vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("OnboardingChecklist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders checklist by default for a fresh user", () => {
    render(<OnboardingChecklist />);
    expect(screen.getByTestId("onboarding-checklist")).toBeInTheDocument();
  });

  it("shows all 5 steps", () => {
    render(<OnboardingChecklist />);
    expect(screen.getByTestId("onboarding-step-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-step-api-key")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-step-billing")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-step-security")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-step-teammate")).toBeInTheDocument();
  });

  it("shows progress counter 0/5 initially", () => {
    render(<OnboardingChecklist />);
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });

  it("marks a step complete when circle is clicked and updates counter", () => {
    render(<OnboardingChecklist />);
    const step = screen.getByTestId("onboarding-step-dashboard");
    const btn = step.querySelector("button");
    fireEvent.click(btn!);
    expect(screen.getByText("1/5")).toBeInTheDocument();
  });

  it("dismisses when X button is clicked", () => {
    render(<OnboardingChecklist />);
    fireEvent.click(screen.getByTestId("button-dismiss-onboarding"));
    expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument();
  });

  it("persists dismissed state to localStorage", () => {
    const { unmount } = render(<OnboardingChecklist />);
    fireEvent.click(screen.getByTestId("button-dismiss-onboarding"));
    unmount();
    render(<OnboardingChecklist />);
    expect(screen.queryByTestId("onboarding-checklist")).not.toBeInTheDocument();
  });
});
