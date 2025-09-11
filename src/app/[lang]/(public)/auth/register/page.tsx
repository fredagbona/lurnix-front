import { RegisterPage } from "../_components/RegisterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to your Lurnix account",
};

export default function RegisterPageComponent() {
  return <RegisterPage />;
}
