// frontend/app/page.tsx
//
// This is the root route ("/").
// It only redirects to the actual login experience at "/login".

import { redirect } from "next/navigation";

export default function Home() {
  // Immediately send the user to /login
  redirect("/login");

  // This return is never actually rendered, but it keeps TS/Next happy.
  return null;
}
