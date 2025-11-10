import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as ThemeWrapper } from "@/contexts/theme-context";
import { TasksProvider } from "@/contexts/tasks-context";
import { ToastProvider } from "@/contexts/toast-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <ThemeWrapper>
          <TasksProvider>
            <ToastProvider>
              <div className={inter.variable}>
                <Component {...pageProps} />
              </div>
            </ToastProvider>
          </TasksProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
