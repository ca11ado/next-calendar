import { NextResponse } from 'next/server';
import generateBlocks from '@/utils/generateBlocks';

export async function GET() {
  const blocks = generateBlocks();

  return NextResponse.json(blocks);
}
