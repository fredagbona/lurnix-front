import { LanguageSwitch } from "@/components/language-switch";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      {/* Language Switch - Fixed at bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <LanguageSwitch />
      </div>
    </div>
  );
}
