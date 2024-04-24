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
        // setComments([]);
        pb.collection('human_rating').getList(1, 100, {
            filter: `human_id = "${human.id}" && comment != ""`,
            sort: '-created',
        }).then(data => {
            setComments(data.items);
        })
    }, [human])

    return <><div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center">
            <ImageFallback
                className="w-200 h-200 rounded-full object-cover shadow-lg"
                src={`https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${human.id}/${human.photo}`}
                alt="User avatar"
                width={200}
                height={200}
                fallbackSrc="/avatar.png"
            />
            <h1 className="mt-4 text-xl font-bold text-gray-900">{human.name}</h1>
        </div>
        <div className="text-gray-700">
            <div>Date: {utc2kst(human.updated)}</div>
        </div>
    </div>

        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">상세 설명</h2>
            <div className="text-gray-700">{human.etc}</div>
        </div>

        <table className="w-full mb-8">
            <thead>
                <tr>
                    <th className="text-left font-bold text-gray-700">평가 항목</th>
                    <th className="text-right font-bold text-gray-700">평점</th>
                </tr>
            </thead>
            <tbody>
                {ratingList.map(r => (
                    <tr key={r.key} className="hover:bg-gray-100">
                        <td className="py-2 text-left text-gray-700">{r.name}</td>
                        <td className="py-2">
                            <div className="flex justify-end items-center space-x-1 mr-1">
                                <RateUI score={Math.round(human[r.key])} />
                                <span className="text-gray-900 font-medium">{human[r.key]}</span>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="bg-gray-200">
                    <td className="py-2 text-left font-bold text-gray-700">평균</td>
                    <td className="py-2">
                        <div className="flex justify-end items-center space-x-1 mr-1">
                            <RateUI score={Math.round(human.average)} />
                            <span className="text-gray-900 font-bold">{human.average.toFixed(1)} ({human.cnt})</span>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>

        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">한줄평</h2>
            <ul className="list-disc list-inside text-gray-700">
                {comments.map(c => <li key={c.id}>{c.comment}</li>)}
            </ul>
        </div>

    </>
}