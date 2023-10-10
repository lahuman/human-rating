import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {

  const year = parseInt(params.year.substring(0, 4), 10);
  if (year < 1900 || year > 2100) {
    return Response.json({ error: true, message: "Invalid year. Please use a year between 1900 and 2100." });
  }
  
  const holidayList = await fetch(
    `https://lahuman.fly.dev/api/collections/holiday/records?perPage=500&filter=(year=${params.year})`,
    {
      cache: 'no-store',
      headers: {
        x_token: process.env.TOKEN as string,
      },
    }
  );
  
  const { items } = await holidayList.json();
  return Response.json({
    holidays: items
      .map((i:any) => ({
        name: i.name,
        date: i.date,
      }))
      .sort((a:any, b:any) => a.date - b.date),
  });
}
