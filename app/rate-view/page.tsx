'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { ratingList } from "../human/rating";
import pb from "../pb";
import ImageFallback from "../human/ImageFallback";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";
import RateUI from "../human/StarUI";
import { RecordModel } from "pocketbase";

interface User {
    id?: string | null;
    name?: string | null;
    photo?: string | null;
}
export default function RateForm() {
    const router = useRouter();
    const [rate, setRate] = useState<RecordModel>();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User>({});
    const { setLoading, loading } = useLoad();


    async function getRateResult(human_id: string) {
        setLoading(true);
        try {
            const result = await pb.collection('personal_average').getFirstListItem(`human_id="${human_id}"`, {
            });
            console.log(result)
            setRate(result);
        } catch (e) {
            console.log(e)
            alert('조회된 대상이 없습니다.');
        }
        setLoading(false);
    }
    useEffect(() => {
        const data = searchParams.get('data');

        if (data) {
            const [id, name, photo] = decodeURIComponent(atob(data)).split("|");
            setUser({
                id: id,
                name: name,
                photo: photo
            });
            getRateResult(id);
        }
    }, []);

    return <>
        {loading && <LoaddingUI />}
        {user.id && <div className="max-w-md m-2"><div className="flex justify-left items-center m-5">
            <ImageFallback
                className="w-12 h-12 rounded-full object-cover mr-4"
                src={`${user.photo}`}
                alt="User avatar"
                width={50}
                height={50}
                fallbackSrc="/avatar.png"
            />
            <h1 className="text-lg font-bold">{user.name}</h1>
        </div>
            <table className="w-full mb-8">
                <thead>
                    <tr>
                        <th className="text-left font-bold text-gray-700">평가 항목</th>
                        <th className="text-right font-bold text-gray-700">평점</th>
                    </tr>
                </thead>
                {rate && <><tbody>
                    {ratingList.map(r => <tr key={r.key}>
                        <td className="text-left text-gray-700">{r.name}</td>
                        <td>
                            <div className="flex justify-end items-center space-x-1 mr-1">
                                <RateUI score={Math.round(rate[r.key])} /> {" "}
                                <span className="w-20 text-center">&nbsp; {rate[r.key]}</span>
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
                                        <RateUI score={Math.round(rate.average)} /> {" "}
                                        <span className="w-20 text-center">&nbsp; {rate.average} ({rate.cnt})</span>
                                    </div>
                                </span>
                            </td>
                        </tr>
                    </tfoot></>
                }
            </table>
            <button
                type="button"
                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                onClick={(e) => {
                    router.push("/");
                }}
            >
                메인으로 이동
            </button>
        </div>
        }
    </>;
}