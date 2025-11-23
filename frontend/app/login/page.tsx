import type { Metadata } from "next";
import { LoginPage as LoginView } from "./components/LoginPage";

export const metadata: Metadata = {
  title: "Sign in | CSE 230",
};

export default function LoginPage() {
  return <LoginView />;
}
