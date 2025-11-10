import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { ThemeProvider as ThemeWrapper } from "@/contexts/theme-context";
import { TasksProvider } from "@/contexts/tasks-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <ThemeWrapper>
        <TasksProvider>
          <div className={inter.variable}>
            <Component {...pageProps} />
          </div>
        </TasksProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}
