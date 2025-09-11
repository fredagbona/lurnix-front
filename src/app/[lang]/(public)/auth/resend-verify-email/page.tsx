import { ResendVerifyEmailPage } from "../_components/ResendVerifyEmailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Verify Email",
  description: "Resend verify email to your Lurnix account",
};

export default function ResendVerifyEmailPageComponent() {
  return <ResendVerifyEmailPage />;
}
