import { LoginPage } from "../_components/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Lurnix account",
};

export default function LoginPageComponent() {
  return <LoginPage />;
}
