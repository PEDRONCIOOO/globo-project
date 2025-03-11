"use client";

import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import { usePathname } from "next/navigation";
import { AnimatedTabs } from "@/components/AnimatedTab";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance (or import it from a separate file like queryClient.ts)
const queryClient = new QueryClient();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (pathname === "/register") {
    return <RegisterPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedTabs />
      {children}
    </QueryClientProvider>
  );
}

export default LayoutContent;