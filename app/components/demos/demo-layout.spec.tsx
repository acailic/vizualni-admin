import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DemoError, DemoEmpty, DemoLayout, DemoLoading } from "./demo-layout";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/header", () => ({
  Header: () => <div data-testid="header-mock">Header</div>,
}));

vi.mock("@/components/flex", () => ({
  Flex: ({ children, ...rest }: any) => (
    <div data-testid="flex-mock" {...rest}>
      {children}
    </div>
  ),
}));

describe("DemoLayout", () => {
  it("renders title, description and dataset info", () => {
    render(
      <DemoLayout
        title="Test Demo"
        description="Description"
        datasetInfo={{
          title: "Dataset title",
          organization: "Org",
          updatedAt: "2024-05-20",
        }}
      >
        <div>content</div>
      </DemoLayout>
    );

    expect(screen.getByText("Test Demo")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText(/Org/)).toBeInTheDocument();
    // the formatted date can vary by locale; assert year is present
    expect(screen.getByText(/2024/)).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("hides back button when hideBackButton is true", () => {
    render(
      <DemoLayout title="No Back" hideBackButton>
        <div>child</div>
      </DemoLayout>
    );

    expect(
      screen.queryByText(/Nazad na demo galeriju/)
    ).not.toBeInTheDocument();
  });
});

describe("Demo helper states", () => {
  it("renders loading with default message", () => {
    render(<DemoLoading />);
    expect(
      screen.getByText(/Učitavanje podataka sa data.gov.rs/i)
    ).toBeInTheDocument();
  });

  it("renders error with retry", () => {
    const onRetry = vi.fn();
    render(<DemoError error="boom" onRetry={onRetry} />);
    screen.getByRole("button", { name: /Pokušaj ponovo/i }).click();
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders empty state message", () => {
    render(<DemoEmpty message="nothing here" />);
    expect(screen.getByText("nothing here")).toBeInTheDocument();
  });
});
