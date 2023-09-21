
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import pb from "../pb";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";

const userFields = [
    { key: "name", name: '이름', type: 'text' },
    { key: "username", name: 'ID', type: 'text' },
    { key: "email", name: 'EMAIL', type: 'email' },
    { key: "password", name: 'PASSWORD', type: 'password' },
    { key: "passwordConfirm", name: 'PASSWORD Confirm', type: 'password' },
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
        "location_val": "한국"
    });

    async function signup() {
        setLoading(true);
        //validation
        const emptyField = userFields.find(u => newUser[u.key].trim() === "");
        if (emptyField) {
            alert(`[${emptyField.name}] 항목을 작성해주세요.`);
            setLoading(false);
            return;
        }

        if (newUser.password.length < 8 && newUser.password.length > 72) {
            alert('비밀번호는 8자이상, 72자 이하로 작성해주세요.');
            setLoading(false);
            return;
        }
        if (newUser.password !== newUser.passwordConfirm) {
            alert('비밀번호와 비밀번호 확인 값이 다릅니다. 확인해주세요.');
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
        alert('가입이 완료 되었습니다.');
        router.push('/')
        // await pb.collection('cstomer_m').requestVerification(newUser.email);

    }
    return <>
        {loading && <LoaddingUI />}<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="mx-auto h-10 w-auto"
                    src="/logo.png"
                    alt="평가 시스템"
                    width={100}
                    height={100}
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    평가 시스템 회원 가입
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {userFields.map(u => <div key={u.key}>
                    <label
                        htmlFor={u.key}
                        className="block text-sm font-medium leading-6 text-gray-900"
                    >
                        {u.name}
                    </label>
                    <div className="mt-2">
                        <input
                            id={u.key}
                            name={u.key}
                            type={u.type}
                            autoComplete={u.key}
                            required
                            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={newUser[u.key]}
                            onChange={(e) =>
                                setNewUser({ ...newUser, [u.key]: e.target.value })
                            }
                        />
                    </div>
                </div>)}


                <div className="pt-5">
                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={(e) => {
                            signup();
                        }}>
                        Sign up
                    </button>
                </div>
            </div>
        </div></>;
}