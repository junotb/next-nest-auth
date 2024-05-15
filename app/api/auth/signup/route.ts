import { addUser } from '@/firebase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SignupRequest {
  username: string;
  password: string;
  confirm: string;
}

export async function POST(req: NextRequest) {
  const { username, password, confirm }: SignupRequest = await req.json();

  if (!username || !password || !confirm) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }
  if (password !== confirm) {
    return NextResponse.json({ error: 'Passwords do not matched' }, { status: 400 });
  }

  try {
    const userId = await addUser(username, password);
    return NextResponse.json({ userId }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}