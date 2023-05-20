import { NextResponse } from 'next/server';
import generateBlocks from '@/app/utils/generateBlocks';

export async function GET() {
  const blocks = generateBlocks();

  return NextResponse.json(blocks);
}
