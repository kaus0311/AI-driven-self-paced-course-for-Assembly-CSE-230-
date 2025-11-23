import type { Metadata } from "next";
import { RegisterPage } from "../login/components/RegisterPage";

export const metadata: Metadata = {
  title: "Create account | CSE 230",
};

export default function Register() {
  return <RegisterPage />;
}
