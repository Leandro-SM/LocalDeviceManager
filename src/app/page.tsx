import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export default async function HomePage() {
  const token = cookies().get("auth_token")?.value;
  const session = token ? await verifyAuthToken(token) : null;

  if (session) {
    redirect("/dashboard");
  }
  redirect("/login");
}
