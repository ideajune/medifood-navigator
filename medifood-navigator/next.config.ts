import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 모바일 테스트 시 로컬 IP 접근 허용 (Next.js 보안 정책 우회)
  allowedDevOrigins: ['192.168.45.197']
};

export default nextConfig;
