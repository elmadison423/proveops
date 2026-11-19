import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {

  try {

    // ==========================================
    // GET AUTHORIZATION TOKEN
    // ==========================================

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {

      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );

    }

    const token =
      authorization.replace(
        "Bearer ",
        ""
      );

    if (!token) {

      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );

    }


    // ==========================================
    // VERIFY LOGGED-IN USER
    // ==========================================

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser(
        token
      );

    if (
      userError ||
      !user
    ) {

      console.error(
        "AUTH ERROR:",
        userError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication.",
        },
        {
          status: 401,
        }
      );

    }


    // ==========================================
    // LOAD ADMIN PROFILE
    // ==========================================

    const {
      data: adminProfile,
      error: profileError,
    } =
      await supabase
        .from("Profiles")
        .select(
          "organization_id, role"
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (
      profileError ||
      !adminProfile
    ) {

      console.error(
        "ADMIN PROFILE ERROR:",
        profileError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify your profile.",
        },
        {
          status: 403,
        }
      );

    }


    // ==========================================
    // VERIFY ORGANIZATION ADMIN
    // ==========================================

    if (
      adminProfile.role !==
      "Organization Admin"
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Only Organization Admins can invite users.",
        },
        {
          status: 403,
        }
      );

    }


    // ==========================================
    // VERIFY ORGANIZATION
    // ==========================================

    if (
      !adminProfile.organization_id
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Your account is not assigned to an organization.",
        },
        {
          status: 403,
        }
      );

    }


    // ==========================================
    // READ INVITATION DATA
    // ==========================================

    const body =
      await request.json();

    const {
      fullName,
      email,
      role,
    } = body;


    if (
      !fullName ||
      !email ||
      !role
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Full name, email, and role are required.",
        },
        {
          status: 400,
        }
      );

    }


   // ==========================================
// SEND AUTH INVITATION
// ==========================================

const {
  data: authData,
  error: authError,
} =
  await supabase.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo:
        `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
    }
  );

if (authError) {

  console.error(
    "AUTH INVITE ERROR:",
    authError
  );

  throw authError;

}


    // ==========================================
    // CREATE PROFILE
    // ==========================================

    const {
      error: newProfileError,
    } =
      await supabase
        .from("Profiles")
        .insert({

          user_id:
            authData.user.id,

          full_name:
            fullName,

          email,

          role,

          organization_id:
            adminProfile.organization_id,

        });


    // ==========================================
    // CLEAN UP AUTH USER IF PROFILE FAILS
    // ==========================================

    if (newProfileError) {

      console.error(
        "PROFILE CREATE ERROR:",
        newProfileError
      );

      await supabase.auth.admin.deleteUser(
        authData.user.id
      );

      throw newProfileError;

    }

    // ==========================================
// CREATE TECHNICIAN RECORD
// ==========================================

if (role === "Technician") {

  const {
    error: technicianError,
  } =
    await supabase
      .from("Technicians")
      .insert({

        name:
          fullName,

        email,

        phone: "",

        role:
          "Technician",

        organization_id:
          adminProfile.organization_id,

        user_id:
          authData.user.id,

      });

  if (technicianError) {

    console.error(
      "TECHNICIAN CREATE ERROR:",
      technicianError
    );

    // Remove Profile
    await supabase
      .from("Profiles")
      .delete()
      .eq(
        "user_id",
        authData.user.id
      );

    // Remove Auth User
    await supabase.auth.admin.deleteUser(
      authData.user.id
    );

    throw technicianError;

  }

}


    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({

      success: true,

    });


  } catch (error) {

    console.error(
      "INVITE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unable to invite user.",
      },
      {
        status: 500,
      }
    );

  }

}