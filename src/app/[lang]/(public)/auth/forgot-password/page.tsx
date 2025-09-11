import { ForgotPasswordPage } from "../_components/ForgotPasswordPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Lurnix account password securely via email.",
};

export default function page() {
  return <ForgotPasswordPage />;
}
