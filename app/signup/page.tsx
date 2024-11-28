"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import pb from "../pb";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";

const userFields = [
    { key: "name", name: '이름', type: 'text' },
    { key: "username", name: '아이디', type: 'text' },
    { key: "email", name: '이메일', type: 'email' },
    { key: "password", name: '비밀번호', type: 'password' },
    { key: "passwordConfirm", name: '비밀번호 확인', type: 'password' },
]

interface User {
    [key: string]: any;
    username: string;
    email: string;
    emailVisibility: boolean;
    password: string;
    passwordConfirm: string;
    name: string;
    location_val: string;
}

export default function Signup() {
    const router = useRouter();
    const { setLoading, loading } = useLoad();
    const [newUser, setNewUser] = useState<User>({
        "username": "",
        "email": "",
        "emailVisibility": true,
        "password": "",
        "passwordConfirm": "",
        "name": "",
        "location_val": "Korea"
    });

    async function signup() {
        setLoading(true);
        //validation
        const emptyField = userFields.find(u => newUser[u.key].trim() === "");
        if (emptyField) {
            alert(`[${emptyField.name}] 항목은 필수입니다.`);
            setLoading(false);
            return;
        }

        if (newUser.password.length < 8 || newUser.password.length > 72) {
            alert('비밀번호는 8자 이상 72자 이하여야 합니다.');
            setLoading(false);
            return;
        }
        if (newUser.password !== newUser.passwordConfirm) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 확인해주세요.');
            setLoading(false);
            return;
        }
        try {
            await pb.collection('cstomer_m').create(newUser);
        } catch (e: any) {
            if (e.status === 400) {
                Object.keys(e.response.data).map((d: string) => {
                    alert(`${d} : ${e.response.data[d].message}`);
                });
                setLoading(false);
                return;
            }
            alert('오류가 발생했습니다. 관리자에게 문의하세요.');
            setLoading(false);
            return;
        }
        setLoading(false);
        alert('회원가입이 완료되었습니다.');
        router.push('/')
    }
    return <>
        {loading && <LoaddingUI />}
        <div className="flex min-h-screen items-center justify-center bg-[#FAE100] px-6 py-16 lg:px-12">
            <div className="w-full max-w-lg space-y-10">
                <div className="flex flex-col items-center">
                    <Image
                        className="h-16 w-auto"
                        src="/logo.png"
                        alt="Evaluation System"
                        width={128}
                        height={128}
                    />
                    <h2 className="mt-8 text-center text-4xl font-bold tracking-tight text-[#3C1E1E]">
                        회원가입
                    </h2>
                    <p className="mt-4 text-center text-lg text-[#3C1E1E] font-semibold">
                        저희와 함께 독점적인 콘텐츠와 서비스를 즐겨보세요.
                    </p>
                </div>
                <form className="mt-10 space-y-8" action="#" method="POST">
                    {userFields.map(u => (
                        <div key={u.key} className="flex flex-col">
                            <label htmlFor={u.key} className="block text-sm font-medium text-[#3C1E1E] mb-2">
                                {u.name}
                            </label>
                            <input
                                id={u.key}
                                name={u.key}
                                type={u.type}
                                autoComplete={u.key}
                                required
                                className="block w-full rounded-md border border-transparent px-4 py-3 text-[#3C1E1E] placeholder-[#3C1E1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F9D342] focus:ring-offset-[#FAE100] bg-white"
                                value={newUser[u.key]}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, [u.key]: e.target.value })
                                }
                            />
                        </div>
                    ))}

                    <div>
                        <button
                            type="button"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#3C1E1E] py-3 px-6 text-lg font-semibold text-[#FAE100] hover:bg-[#2E1515] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E1515] focus:ring-offset-[#FAE100]"
                            onClick={(e) => {
                                signup();
                            }}>
                            회원가입
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-3 px-6 text-lg font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-[#191414]"
                            onClick={(e) => {
                                window.history.back();
                            }}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>;
}
