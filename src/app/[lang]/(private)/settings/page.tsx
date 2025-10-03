"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  UpdateProfileTab,
  PasswordUpdateForm,
  LanguageProfile,
  DeleteAccount,
  LinkedAccounts,
} from "./_components";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  type SettingsTab = "profile" | "password" | "language" | "linked_accounts" | "account";
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">{t("title")}</h1>
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: "profile", label: t("tabs.profile") },
            { id: "password", label: t("tabs.password") },
            { id: "language", label: t("tabs.language") },
            { id: "linked_accounts", label: t("tabs.linked_accounts") },
            { id: "account", label: t("tabs.account") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {activeTab === "profile" && <UpdateProfileTab />}
      {activeTab === "password" && <PasswordUpdateForm />}
      {activeTab === "language" && <LanguageProfile />}
      {activeTab === "linked_accounts" && <LinkedAccounts />}
      {activeTab === "account" && <DeleteAccount />}
    </div>
  );
}
