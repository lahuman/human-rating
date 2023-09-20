import { RecordModel } from "pocketbase";
import ImageFallback from "./ImageFallback";
import RateUI from "./RateUI";
import { useEffect, useState } from "react";
import pb from "../pb";
import { ratingList } from "./rating";


export default function View({ human }: { human: RecordModel }) {

    const [comments, setComments] = useState<RecordModel[]>([]);

    useEffect(() => {
        // setComments([]);
        pb.collection('human_rating').getList(1, 100, {
            filter: `human_id = "${human.id}" && comment != ""`,
            sort: '-created',
        }).then(data => {
            setComments(data.items);
        })
    }, [human])

    return <><div className="flex justify-between mb-6">
        <div className="grid justify-items-center">
            <ImageFallback
                className="w-200 h-200 object-cover mr-4"
                src={`https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${human.id}/${human.photo}`}
                alt="User avatar"
                width={200}
                height={200}
                fallbackSrc="/avatar.png"
            />

            <h1 className="text-lg font-bold">{human.name}</h1>
        </div>
        <div className="text-gray-700">
            <div>Date: {human.updated}</div>
        </div>
    </div>

        <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">상세 설명</h2>
            <div className="text-gray-700 mb-2"> {human.etc}</div>
        </div>
        <table className="w-full mb-8">
            <thead>
                <tr>
                    <th className="text-left font-bold text-gray-700">평가 항목</th>
                    <th className="text-right font-bold text-gray-700">평점</th>
                </tr>
            </thead>
            <tbody>
                {ratingList.map(r => <tr key={r.key}>
                    <td className="text-left text-gray-700">{r.name}</td>
                    <td>
                        <div className="flex justify-end items-center space-x-1 mr-1">
                            <RateUI score={Math.round(human[r.key])} /> {" "}
                            <span className="w-20 text-center">&nbsp; {human[r.key]}</span>
                        </div>
                    </td>
                </tr>)}
            </tbody>
            <tfoot>
                <tr>
                    <td className="text-left font-bold text-gray-700">평균</td>
                    <td >
                        <span className="text-gray-700 font-bold">
                            <div className="flex justify-end items-center space-x-1 mr-1">
                                <RateUI score={Math.round(human.problem_solve)} /> {" "}
                                <span className="w-20 text-center">&nbsp; {human.problem_solve} ({human.cnt})</span>
                            </div>
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>

        <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">한줄평</h2>
            <div className="text-gray-700 mb-2">
                <ul className="list-disc">
                    {comments.map(c => <li key={c.id}>{c.comment}</li>)}
                </ul>
            </div>
        </div>

    </>
}