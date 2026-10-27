import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, childName, theme, downloadUrl, bookCount } = await req.json();

    if (!email || !downloadUrl) {
      return NextResponse.json({ error: 'Missing email or download URL' }, { status: 400 });
    }

    const recipient = email.trim();
    const hero = childName || 'Your Child';
    const isBundle = Number(bookCount) > 1;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #FFFDF9; border: 1px solid #fed7aa; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ea580c; margin-bottom: 4px; font-size: 26px;">🎨 MyColoringStar</h1>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Your Personalized Adventure is Ready!</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">
            ${isBundle ? `Your 3-Book Bundle is Ready!` : `${hero}'s${theme} Coloring Book is Ready!`}
          </h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Thank you for ordering with us. You can download and print your high-resolution custom PDF book using the link below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background-color: #ea580c; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 8px; display: inline-block;">
              📥 Download Printable PDF
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            💡 <strong>Printing tip:</strong> Works on any standard home printer (US Letter or A4). For markers, standard 65lb+ cardstock works best!
          </p>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 11px;">
          Published by MyColoringStar • www.mycoloringstar.com
        </p>
      </div>
    `;

    const sender = process.env.NODE_ENV === 'production' && !process.env.RESEND_USE_ONBOARDING
      ? 'MyColoringStar <orders@mycoloringstar.com>'
      : 'MyColoringStar <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      subject: isBundle
        ? `🎁 Your Custom 3-Book Coloring Bundle is Ready to Download!`
        : `🎨 ${hero}'s ${theme} Coloring Book is Ready to Download!`,
      html: emailHtml
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Email send failed:', err);
    return NextResponse.json({ error: err.message || 'Failed sending email' }, { status: 500 });
  }
}