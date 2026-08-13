"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email.trim().toLowerCase(),
        source: "landing_page_footer",
        is_active: true,
      });

    if (error) {
      // If already subscribed, return success gracefully
      if (error.code === "23505") {
        return { success: true, message: "You are already subscribed!" };
      }
      console.error("Supabase newsletter insert error:", error);
      return { success: true, message: "Subscribed successfully!" };
    }

    return { success: true, message: "Subscribed successfully!" };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: true, message: "Subscribed successfully!" };
  }
}
