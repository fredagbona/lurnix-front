"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Home, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function ProfileTestSuccessPage() {
  const t = useTranslations("ProfileTestSuccess");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-4">
      <Card className="max-w-2xl w-full p-6 sm:p-8 md:p-12 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="relative space-y-5 sm:space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-green-100 dark:bg-green-900/30 rounded-full p-4 sm:p-6">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-2">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">{t("subtitle")}</p>
          </div>

          {/* Message */}
          <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base font-semibold">{t("achievement")}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("message")}</p>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("nextStep")}</p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/technical-assessment")}
                className="gap-2 w-full sm:w-auto"
              >
                {t("continueButton")}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="gap-2 w-full sm:w-auto"
              >
                <Home className="h-4 w-4" />
                {t("dashboardButton")}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{t("step1")}</span>
              </div>
              <div className="w-6 sm:w-8 h-px bg-border flex-shrink-0" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="whitespace-nowrap">{t("step2")}</span>
              </div>
              <div className="w-6 sm:w-8 h-px bg-border flex-shrink-0" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted flex-shrink-0" />
                <span className="whitespace-nowrap">{t("step3")}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
