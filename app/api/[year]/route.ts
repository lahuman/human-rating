import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  const holidayList = await fetch(
    `https://lahuman.fly.dev/api/collections/holiday/records?perPage=500&filter=(year=${params.year})`,
    {
      headers: {
        x_token: process.env.TOKEN,
      },
    }
  );
  const { items } = await holidayList.json();
  return Response.json({
    holidays: items
      .map((i) => ({
        name: i.name,
        date: i.date,
      }))
      .sort((a, b) => a.date - b.date),
  });
}
