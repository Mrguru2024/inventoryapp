interface PasswordResetEmailProps {
  resetUrl: string;
  userName: string;
}

export function PasswordResetEmail({ resetUrl, userName }: PasswordResetEmailProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Reset your password</title>
        <style>
          /* Base */
          body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          
          .container {
            display: block;
            max-width: 580px;
            padding: 10px;
            margin: 0 auto;
          }
          
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px;
            background: #ffffff;
            border-radius: 3px;
          }
          
          .header {
            padding: 20px 0;
            text-align: center;
            background-color: #3b82f6;
            border-radius: 3px 3px 0 0;
          }
          
          .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .main {
            background: #ffffff;
            border-radius: 3px;
            padding: 20px;
          }
          
          .footer {
            clear: both;
            padding-top: 10px;
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #999999;
          }
          
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            background-color: #3b82f6;
            border-radius: 5px;
            color: #ffffff;
            text-decoration: none;
            text-align: center;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="main">
              <p>Hi ${userName},</p>
              <p>We received a request to reset your password for your Key Inventory System account. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${resetUrl}</p>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>Key Inventory System Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
} 