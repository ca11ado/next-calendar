import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/utils/mockedEvents.json');

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data.events);
  } catch (error) {
    console.error('Failed to read file:', error);
    return NextResponse.error();
  }
}
