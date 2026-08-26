import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {

  try {

    const body = await request.json();

    console.log("STEP 1");
console.log(body);

    const {
      userId,
      organization,
      fullName,
      email,
      phone,
      dispatchRegion,
    } = body;

    console.log("STEP 2");

    // Create Organization
    const {
      data: newOrganization,
      error: organizationError,
    } = await supabase
      .from("Organizations")
      .insert({
        name: organization,
        contact_email: email,
        phone,
        dispatch_region: dispatchRegion,
      })
      .select()
      .single();

      console.log("STEP 3");
console.log(newOrganization);
console.log(organizationError);

    if (organizationError) {
      throw organizationError;
    }

    console.log("STEP 4");

    // Create Profile
    const { error: profileError } =
      await supabase
        .from("Profiles")
        .insert({
          user_id: userId,
          full_name: fullName,
          email: email,
          organization_id: newOrganization.id,
          role: "Organization Admin",
        });

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json({
      success: true,
      organizationId: newOrganization.id,
    });

  } catch (error) {

  console.error("REGISTER API ERROR:");
  console.error(error);

  return NextResponse.json(
    {
      success: false,
      error: error.message,
      details: error,
    },
    {
      status: 500,
    }
  );

}

}