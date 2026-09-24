import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusBar } from "@/components/StatusBar";

describe("StatusBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("renders operational status by default", () => {
    render(<StatusBar />);
    expect(screen.getByText("All systems operational")).toBeInTheDocument();
  });

  it("shows API, Auth, DB service labels", () => {
    render(<StatusBar />);
    expect(screen.getByText(/API/)).toBeInTheDocument();
    expect(screen.getByText(/Auth/)).toBeInTheDocument();
    expect(screen.getByText(/DB/)).toBeInTheDocument();
  });

  it("shows an updated timestamp", () => {
    render(<StatusBar />);
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });
});
