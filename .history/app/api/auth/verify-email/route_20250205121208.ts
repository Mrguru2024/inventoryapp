import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createTransport } from 'nodemailer';

const prisma = new PrismaClient();

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const verificationToken = Math.random().toString(36).substring(2);
    
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: null,
        verificationToken
      }
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    });

    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 