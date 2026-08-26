import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {

    const body = await request.json();

    const {
      fullName,
      email,
      role,
      organizationId,
    } = body;

    // Create Auth User
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
  email,
  password: "Welcome123!",
  email_confirm: true,
});

    if (authError) {
      throw authError;
    }

    // Create Profile
    const { error: profileError } =
      await supabase
        .from("Profiles")
        .insert({
          user_id: authData.user.id,
          full_name: fullName,
          email,
          role,
          organization_id: organizationId,
        });

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}