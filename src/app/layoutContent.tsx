"use client";

import { usePathname } from "next/navigation";
import { AnimatedTabs } from "@/components/AnimatedTab";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance (or import it from a separate file like queryClient.ts)
const queryClient = new QueryClient();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedTabs />
      {children}
    </QueryClientProvider>
  );
}

export default LayoutContent;