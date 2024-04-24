
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
        setLoading(false);
        alert('가입이 완료 되었습니다.');
        router.push('/')
        // await pb.collection('cstomer_m').requestVerification(newUser.email);

    }
    return <>
        {loading && <LoaddingUI />}
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700 px-4 py-12 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <Image
                        className="h-12 w-auto"
                        src="/logo.png"
                        alt="평가 시스템"
                        width={100}
                        height={100}
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                    {userFields.map(u => (
                        <div key={u.key} className="flex items-center space-x-3">
                            <label htmlFor={u.key} className="block text-sm font-medium text-gray-100 w-1/3">
                                {u.name}
                            </label>
                            <input
                                id={u.key}
                                name={u.key}
                                type={u.type}
                                autoComplete={u.key}
                                required
                                className="flex-1 block w-full appearance-none rounded-md border border-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={(e) => {
                                signup();
                            }}>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>;
}