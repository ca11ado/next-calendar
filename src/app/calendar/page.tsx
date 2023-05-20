import CalendarPage from "@/components/CalendarPage";
import { Block } from "@/utils/generateBlocks";

async function getData() {
  const url = `${process.env.BASE_URL}/api/days`;
  const res = await fetch(url);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data: ${url}`);
  }

  return res.json();
}


export default async function Calendar() {
  let blocks: Array<Block> = [];
  try {
    const blocks = await getData();
  } catch (e) {
    console.log(e)
  }
  return <CalendarPage>{blocks.map((block: Block) => (
    <div key={block.id}>{block.day}</div>
  ))}</CalendarPage>
}
