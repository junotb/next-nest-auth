import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id, pwd } = await request.json();
  NextResponse.json("로그인 성공");
}