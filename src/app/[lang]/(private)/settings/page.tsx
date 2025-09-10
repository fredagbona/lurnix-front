"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user";
import { UpdateProfileData, UpdatePasswordData } from "@/models";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "account">("profile");

  // Profile form state
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    username: "",
    fullname: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password form state
  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Account deletion state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await userService.updateProfile(profileData);
      setProfileMessage({ type: "success", text: t("profile.success") });
    } catch (error: any) {
      setProfileMessage({ type: "error", text: t("profile.error") });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);
    try {
      await userService.updatePassword(passwordData);
      setPasswordMessage({ type: "success", text: t("password.success") });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      setPasswordMessage({ type: "error", text: t("password.error") });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteMessage(null);
    try {
      await userService.deleteAccount({ password: deletePassword });
      setDeleteMessage({ type: "success", text: t("account.success") });
    } catch (error: any) {
      setDeleteMessage({ type: "error", text: t("account.error") });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">{t("title")}</h1>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: "profile", label: t("tabs.profile") },
            { id: "password", label: t("tabs.password") },
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <h2 className="text-lg font-medium">{t("profile.title")}</h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              {t("profile.username")}
            </label>
            <input
              id="username"
              type="text"
              required
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fullname">
              {t("profile.fullname")}
            </label>
            <input
              id="fullname"
              type="text"
              required
              value={profileData.fullname}
              onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t("profile.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button type="submit" disabled={profileLoading}>
            {profileLoading ? t("profile.loading") : t("profile.submit")}
          </Button>
          {profileMessage && (
            <p
              className={`text-sm ${profileMessage.type === "success" ? "text-success" : "text-destructive"}`}
            >
              {profileMessage.text}
            </p>
          )}
        </form>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <h2 className="text-lg font-medium">{t("password.title")}</h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
              {t("password.current")}
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
              {t("password.new")}
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? t("password.loading") : t("password.submit")}
          </Button>
          {passwordMessage && (
            <p
              className={`text-sm ${passwordMessage.type === "success" ? "text-success" : "text-destructive"}`}
            >
              {passwordMessage.text}
            </p>
          )}
        </form>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
          <h2 className="text-lg font-medium text-destructive">{t("account.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("account.warning")}</p>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="deletePassword">
              {t("account.password")}
            </label>
            <input
              id="deletePassword"
              type="password"
              required
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button type="submit" disabled={deleteLoading} variant="destructive">
            {deleteLoading ? t("account.loading") : t("account.submit")}
          </Button>
          {deleteMessage && (
            <p
              className={`text-sm ${deleteMessage.type === "success" ? "text-success" : "text-destructive"}`}
            >
              {deleteMessage.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
