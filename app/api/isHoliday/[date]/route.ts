import { type NextRequest } from "next/server";

function isWeekendFromString(dateString: string) {
  const dateRegex = /^\d{8}$/;
  if (!dateRegex.test(dateString)) {
    throw new Error("Invalid date string format. Please use YYYYMMDD.");
  }

  // Extract year, month, and day components from the input string
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-based (0-11)
  const day = parseInt(dateString.substring(6, 8), 10);

  // Validate year, month, and day
  if (year < 1900 || year > 2100) {
    throw new Error("Invalid year. Please use a year between 1900 and 2100.");
  }
  if (month < 0 || month > 11) {
    throw new Error("Invalid month. Please use a month between 01 and 12.");
  }
  if (day < 1 || day > 31) {
    throw new Error("Invalid day. Please use a day between 01 and 31.");
  }

  const date = new Date(year, month, day);

  // Check if the parsed date is a weekend
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 represents Sunday, 6 represents Saturday
}

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const isWeekend = isWeekendFromString(params.date);
    const holidayList = await fetch(
      `https://lahuman.fly.dev/api/collections/holiday/records?perPage=500&filter=(date='${params.date}')`,
      {
        headers: {
          x_token: process.env.TOKEN,
        },
      }
    );
    const { items } = await holidayList.json();

    return Response.json({ holiday: isWeekend || items.length > 0 });
  } catch (e: any) {
    return Response.json({ error: true, message: e.message });
  }
}
