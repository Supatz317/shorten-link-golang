import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { shortLink: string } }) {
    const { shortLink } = await params;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${shortLink}`);
    if (response.status !== 200) {
        console.error('Error fetching original URL:', response.statusText);
        return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }
    const originalUrl = response.data.original_url; 
    return NextResponse.redirect(originalUrl);
}