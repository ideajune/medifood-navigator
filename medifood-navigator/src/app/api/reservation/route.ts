import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, age, message } = await request.json();

    if (!name || !phone || !age) {
      return NextResponse.json({ error: '이름, 연락처, 연령대는 필수 항목입니다.' }, { status: 400 });
    }

    // 환경변수에서 이메일 자격증명 가져오기
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.warn('EMAIL_USER 또는 EMAIL_PASS 환경변수가 설정되지 않아 메일을 발송할 수 없습니다.');
      // 환경변수가 없더라도 프론트엔드 테스트를 위해 성공으로 응답 (추후 설정 필요)
      return NextResponse.json({ success: true, warning: '이메일 환경변수 누락' });
    }

    // SMTP 트랜스포터 생성 (Gmail 기준)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    // 이메일 내용 구성
    const mailOptions = {
      from: user,
      to: user, // 본인(관리자)에게 발송
      subject: `[메디푸드 네비게이터] 1:1 상담 예약 접수 - ${name}님`,
      html: `
        <div style="font-family: 'Malgun Gothic', sans-serif; max-w-2xl; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px;">새로운 1:1 상담 예약이 접수되었습니다!</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <th style="padding: 10px; border: 1px solid #e5e7eb; background-color: #f3f4f6; width: 100px; text-align: left;">이름</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left;">연락처</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left;">연령대</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${age}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left;">사전 문의</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message || '없음'}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #e5e7eb; background-color: #f3f4f6; text-align: left;">접수 시간</th>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date().toLocaleString('ko-KR')}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">평일 기준 2일 내에 고객님께 연락을 취해주세요.</p>
        </div>
      `,
    };

    // 메일 발송
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: '메일 발송 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
