/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method === "GET") {
    return jsonResponse({
      success: true,
      message: "send-approval-email function is running. Use POST with JSON body.",
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed. Use POST." },
      405
    );
  }

  try {
    const body = await req.json();
    console.log("REQUEST BODY:", body);

    const email = body.email;
    const fullName = body.full_name || body.username;
    const hotelName = body.hotelName || body.hotel_name;

    if (!email || !fullName || !hotelName) {
      return jsonResponse(
        {
          success: false,
          error: "Thiếu email, full_name/username hoặc hotelName/hotel_name",
          received: body,
        },
        400
      );
    }

    if (!RESEND_API_KEY) {
      return jsonResponse(
        {
          success: false,
          error: "Thiếu RESEND_API_KEY trong Supabase Secrets",
        },
        500
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; padding:28px; border:1px solid #e5e7eb;">
          <h2 style="color:#00a9c8; margin-top:0;">
            Yêu cầu đăng ký Host đã được duyệt
          </h2>

          <p>Xin chào <b>${fullName}</b>,</p>

          <p>
            Admin của <b>Hotel Booking App</b> đã phê duyệt yêu cầu đăng ký tài khoản Host của bạn.
          </p>

          <div style="background:#f1f5f9; padding:18px; border-radius:12px; margin:20px 0;">
            <p><b>Tên đăng nhập:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Tên khách sạn:</b> ${hotelName}</p>
            <p><b>Trạng thái:</b> Đã duyệt</p>
          </div>

          <p>
            Bạn có thể đăng nhập vào hệ thống Host để quản lý khách sạn của mình.
          </p>

          <p style="margin-top:28px;">
            Trân trọng,<br/>
            <b>Admin Hotel Booking App</b>
          </p>
        </div>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hotel Booking App <onboarding@resend.dev>",
        to: [email],
        subject: "Tài khoản Host của bạn đã được duyệt",
        html,
      }),
    });

    const resendText = await resendRes.text();

    console.log("RESEND STATUS:", resendRes.status);
    console.log("RESEND RESPONSE:", resendText);

    let resendData: unknown;

    try {
      resendData = JSON.parse(resendText);
    } catch {
      resendData = resendText;
    }

    if (!resendRes.ok) {
      return jsonResponse(
        {
          success: false,
          error: "Resend gửi email thất bại",
          detail: resendData,
        },
        400
      );
    }

    return jsonResponse({
      success: true,
      message: "Email sent successfully",
      data: resendData,
    });
  } catch (error) {
    console.log("FUNCTION ERROR:", error);

    return jsonResponse(
      {
        success: false,
        error: String(error),
      },
      500
    );
  }
});