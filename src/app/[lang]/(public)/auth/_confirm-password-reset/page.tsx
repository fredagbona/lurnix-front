import { Metadata } from "next";
import { ConfirmPasswordResetPage } from "../_components/ConfirmPasswordResetPage";

export const metadata: Metadata = {
  title: "Confirm Password Reset",
  description: "Confirm your password reset with the token from your email.",
};

export default function ConfirmPasswordResetPageComponent() {
  return <ConfirmPasswordResetPage />;
}
