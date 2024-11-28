import { RecordModel } from "pocketbase";
import ImageFallback from "./ImageFallback";
import RateUI from "./StarUI";
import { useEffect, useState } from "react";
import pb from "../pb";
import { ratingList } from "./rating";

export default function View({ human }: { human: RecordModel }) {
  const [comments, setComments] = useState<RecordModel[]>([]);

  function utc2kst(utcDate: string) {
    var dateUTC = new Date(utcDate);
    dateUTC.setHours(dateUTC.getHours() + 9);
    return dateUTC.toISOString().replace("T", " ").replace("Z", "");
  }

  useEffect(() => {
    pb.collection("human_rating").getList(1, 100, {
      filter: `human_id = "${human.id}" && comment != ""`,
      sort: "-created",
    }).then((data) => {
      setComments(data.items);
    });
  }, [human]);

  return (
    <>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
        <ImageFallback
          className="w-24 h-24 rounded-full object-cover shadow-md mb-4"
          src={`https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${human.id}/${human.photo}`}
          alt="User avatar"
          width={96}
          height={96}
          fallbackSrc="/avatar.png"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{human.name}</h1>
        <div className="text-sm text-gray-500">최근 업데이트: {utc2kst(human.updated)}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
        <div className="text-gray-700">{human.etc}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">평가 항목</h2>
        <table className="w-full">
          <tbody>
            {ratingList.map((r) => (
              <tr key={r.key} className="border-b last:border-b-0">
                <td className="py-3 text-left text-gray-700">{r.name}</td>
                <td className="py-3 text-right">
                  <div className="flex justify-end items-center space-x-1">
                    <RateUI score={Math.round(human[r.key])} />
                    <span className="text-gray-900 font-medium">{human[r.key]}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td className="py-3 text-left font-bold text-gray-700">평균</td>
              <td className="py-3 text-right">
                <div className="flex justify-end items-center space-x-1">
                  <RateUI score={Math.round(human.average)} />
                  <span className="text-gray-900 font-bold">
                    {human.average?.toFixed(1)} ({human.cnt})
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-gray-900 mb-3">한줄평</h2>
        <ul className="list-none space-y-3 text-gray-700">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <p className="text-gray-900">{c.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
