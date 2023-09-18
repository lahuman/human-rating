"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pb from "../pb";
import { RecordModel } from "pocketbase";

export default function Human() {
  const router = useRouter();

  const [list, setList] = useState<RecordModel[]>([]);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login");
    } else {
      pb.collection("human_info")
        .getFullList({})
        .then((user) => {
          pb.collection("personal_average")
            .getFullList({})
            .then((avg) => {
              setList(
                user.map((u) => {
                  u.score = 0;
                  u.cnt = 0;
                  const thisAvg = avg.find((a) => a.human_id === u.id);
                  if (thisAvg) {
                    u.score = thisAvg.average;
                    u.cnt = thisAvg.cnt;
                  }
                  return u;
                })
              );
            });
        });
    }
  }, [router]);
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden max-w-lg mx-auto mt-16">
      <div className="bg-gray-100 py-2 px-4 flex justify-between">
        <h2 className="text-xl font-semibold text-gray-800">평가 대상 목록</h2>

        <button
          className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={(e) => {}}
        >
          대상 추가
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        {list &&
          list.map((data, idx) => {
            return (
              <li key={data.id} className="flex items-center py-4 px-6">
                <span className="text-gray-700 text-lg font-medium mr-4">
                  {idx + 1}.
                </span>
                <Image
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  src={`https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${data.id}/${data.photo}`}
                  alt="User avatar"
                  width={50}
                  height={50}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {data.name}
                  </h3>
                  <span className="text-gray-600 text-base">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, idx) => {
                        if (idx + 1 < data.score) {
                          return (
                            <svg
                              key={idx}
                              className="w-4 h-4 text-yellow-300"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          );
                        }
                        return (
                          <svg
                            key={idx}
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        );
                      })}{" "}
                      &nbsp; {data.score} ({data.cnt})
                    </div>
                  </span>
                </div>
                <button
                  className="flex justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={(e) => {}}
                >
                  평가
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
