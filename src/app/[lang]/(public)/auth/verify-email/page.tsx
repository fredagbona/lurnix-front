import { Metadata } from "next";
import { VerifyEmailPage } from "../_components/VerifyEmailPage";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your Lurnix account email.",
};

export default function VerifyEmailPageComponent() {
  return <VerifyEmailPage />;
}
