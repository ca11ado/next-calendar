import CalendarPage from "@/components/CalendarPage";
import { Block } from "@/utils/generateBlocks";

async function getData() {
  const res = await fetch(`${process.env.BASE_URL}/api/days`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}


export default async function Calendar() {
  const blocks = await getData();
  return <CalendarPage>{blocks.map((block: Block) => (
    <div key={block.id}>{block.day}</div>
  ))}</CalendarPage>
}
