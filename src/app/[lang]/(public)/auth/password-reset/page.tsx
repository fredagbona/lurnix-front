import { Metadata } from "next";
import { ResetPasswordPage } from "../_components/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Password Reset",
  description: "Reset your Lurnix account password securely via email.",
};

export default function PasswordResetPageComponent() {
  return <ResetPasswordPage />;
}
