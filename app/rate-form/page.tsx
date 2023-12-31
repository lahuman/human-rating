'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rate } from "../human/page";
import RateFormUI from "../human/RateForm";
import { useSearchParams } from 'next/navigation';
import { emptyRate, ratingList } from "../human/rating";
import pb from "../pb";
import ImageFallback from "../human/ImageFallback";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";

interface User {
    id?: string | null;
    name?: string | null;
    photo?: string | null;
}
export default function RateForm() {
    const router = useRouter();
    const [rate, setRate] = useState<Rate>(emptyRate);
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User>({});
    const { setLoading, loading } = useLoad();

    function hasProcess(id: string) {
        const item = localStorage.getItem(id);
        if (item) {
            alert('이미 진행하셨습니다.');
            setLoading(false);
            router.push(`/rate-view?data=${searchParams.get('data')}`);
            return false;
        }
        return true;
    }
    async function rating() {
        setLoading(true);
        const id = user.id;
        if (id && hasProcess(id)) {
            const notFillRow = ratingList.find(r => rate[r.key] === 0);
            if (notFillRow) {
                alert(`[${notFillRow.name}] 항목을 작성 해주세요.`);
                setLoading(false);
                return;
            }

            await pb.collection('human_rating').create({
                ...rate,
                human_id: id,
            });

            localStorage.setItem(id, id);
            setRate(emptyRate);
            alert('평가에 참여해주셔서 감사합니다.');
            setLoading(false);
            router.push(`/rate-view?data=${searchParams.get('data')}`);
            return;
        }
        alert("잘못된 접근 입니다.");
        setLoading(false);
    }

    useEffect(() => {
        const data = searchParams.get('data');

        if (data) {
            const [id, name, photo] = decodeURIComponent(atob(data)).split("|");
            if (hasProcess(id)) {
                setUser({
                    id: id,
                    name: name,
                    photo: photo
                });
            }
        }
    }, []);

    return <>
        {loading && <LoaddingUI />}
        {user.id && <div className="max-w-md m-2">
            <div className="flex items-start justify-between p-4 border-b rounded-t ">
                <h3 className="flex items-center font-semibold text-gray-900 ">
                    <ImageFallback
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        src={user.photo}
                        alt="User avatar"
                        width={50}
                        height={50}
                        fallbackSrc="/avatar.png"
                    />{`${user.name}님의`} 평가를 부탁드려요!
                </h3>
            </div>
            <RateFormUI rate={rate} setRate={setRate} />
            <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
                <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                    onClick={e => rating()}>등록</button>
            </div>
        </div>}
    </>;
}