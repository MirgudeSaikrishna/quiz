import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return null;
    }
    
    return {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
    };
  } catch (error) {
    console.error('Auth token error:', error);
    return null;
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized. Please log in.' }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}