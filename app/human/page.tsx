"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pb from "../pb";
import { RecordModel } from "pocketbase";
import ImageFallback from "./ImageFallback";
import { useAuth } from "@/context/AuthContext";

enum ACTION {
  REG = "REG",
  MOD = "MOD",
  VIEW = "VIEW",
  RATE = "RATE"
}

interface Human {
  id?: string;
  name?: string;
  birth_date?: number;
  sex?: string;
  etc?: string;
}

interface Rate {
  [key: string]: any;
  apperance: number;
  interpersonal: number;
  communication: number;
  proferssional: number;
  ethical: number;
  problem_solve: number;
  comment: string;
  human_id?: string;
}

const emptyRate = {
  apperance: 0,
  interpersonal: 0,
  communication: 0,
  proferssional: 0,
  ethical: 0,
  problem_solve: 0,
  comment: ""
}

const ratingList = [
  { "key": "apperance", name: '외형' },
  { "key": "interpersonal", name: '대인관계' },
  { "key": "communication", name: '소통' },
  { "key": "proferssional", name: '업무' },
  { "key": "ethical", name: '도덕성' },
  { "key": "problem_solve", name: '문제해결' }
]

export default function Human() {
  const router = useRouter();
  const { logout } = useAuth();
  const [list, setList] = useState<RecordModel[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [human, setHuman] = useState<RecordModel>();
  const [action, setAction] = useState<ACTION>(ACTION.REG);
  const [newHuman, setNewHuman] = useState<Human>({});
  const [rate, setRate] = useState<Rate>(emptyRate);

  function rateUi(score: number) {
    return [...Array(5)].map((_, idx) => {
      if (idx + 1 <= score) {
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
    })
  }

  function getList() {
    pb.collection("human_info")
      .getFullList({})
      .then((user) => {
        pb.collection("personal_average")
          .getFullList({})
          .then((avg) => {
            setList(
              user.map((u) => {
                const thisAvg = avg.find((a) => a.human_id === u.id);

                return { ...thisAvg, ...u };
              })
            );
          });
      });
  }

  function validNMakeData() {

    if (newHuman.name && newHuman.name !== "" && newHuman.birth_date) {

      const fileInput = document.getElementById('file_input') as HTMLInputElement;
      const selectedFile = fileInput?.files && fileInput?.files[0];
      if (selectedFile) {
        // 첨부파일 있음
        const formData = new FormData();
        formData.append("name", newHuman.name || "");
        formData.append("birth_date", String(newHuman.birth_date) || "0");
        formData.append("sex", newHuman.sex || "M");
        formData.append("etc", newHuman.etc || "");
        formData.append("photo", selectedFile);
        return formData;
      } else {
        return newHuman;
      }
    }
    alert("이름과 생년월일은 필수 값입니다.");
    return null;
  }

  function resetForm() {
    setNewHuman({});
    (document.getElementById('file_input') as HTMLInputElement).value = "";
    getList();
    setModalShow(false);
  }

  async function update() {
    const data = validNMakeData();
    if (data) {
      await pb.collection('human_info').update(String(newHuman?.id), data);
      resetForm();
    }
  }
  async function create() {
    try {
      const data = validNMakeData();
      if (data) {
        await pb.collection('human_info').create(data);
        resetForm();
      }
    } catch (e: any) {
      if (e.status === 400) {
        alert("이미 등록 된 대상입니다.");
      }
    }
  }

  async function rating() {
    const notFillRow = ratingList.find(r => rate[r.key] === 0);
    if (notFillRow) {
      alert(`[${notFillRow.name}] 항목을 작성 해주세요.`);
      return;
    }

    const record = await pb.collection('human_rating').create({
      ...rate,
      human_id: human?.id
    });

    setHuman(undefined);
    setRate(emptyRate);
    setModalShow(false);
    getList();
  }


  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login");
    } else {
      getList();
    }
  }, []);
  return (
    <>
      {/*  Main modal */}
      <div id="defaultModal" tabIndex={-1} aria-hidden="true" className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${modalShow ? '' : 'hidden'}`}>
        <div className="relative w-full  max-h-full">
          {/*  Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/*  Modal header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {human && `${human.name}의`} 평가 상세
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal"
                onClick={e => setModalShow(false)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*  Modal body */}
            <div className="p-6 space-y-6">
              {action === ACTION.VIEW && human && <><div className="flex justify-between mb-6">
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
                  {/* <div className="text-gray-700 mb-2">123 Main St.</div>
                <div className="text-gray-700 mb-2">Anytown, USA 12345</div>
                <div className="text-gray-700">johndoe@example.com</div> */}
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
                          {rateUi(Math.round(human[r.key]))}{" "}
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
                            {rateUi(Math.round(human.problem_solve))}{" "}
                            <span className="w-20 text-center">&nbsp; {human.problem_solve} ({human.cnt})</span>
                          </div>
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                {/* <div className="text-gray-700 mb-2">재미로 평가된 항목입니다.</div> */}
                {/* <div className="text-red-700 text-sm">공유 금지</div> */}

              </>
              }
              {(action === ACTION.REG || action === ACTION.MOD) && <>

                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이름</label>
                  <input type="text" id="name" value={newHuman.name || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => {
                    setNewHuman({ ...newHuman, name: e.target.value });
                  }} />
                </div>
                <div className="mb-6">
                  <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">사진</label>
                  <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" accept="image/*" />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>

                </div>
                <div className="mb-6">
                  <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">생년월일</label>
                  <input type="text" maxLength={8} id="birthDate" value={newHuman.birth_date || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => {
                    setNewHuman({ ...newHuman, birth_date: parseInt(e.target.value) || 0 });
                  }} />
                </div>
                <div className="mb-6">
                  <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">성별</label>
                  <select id="sex" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={newHuman.sex || 'M'} onChange={e => {
                      setNewHuman({ ...newHuman, sex: e.target.value });
                    }}>
                    <option value={'M'}>남</option>
                    <option value={'F'}>여</option>
                    <option value={'E'}>기타</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="etc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">특징</label>
                  <input type="text" id="etc" value={newHuman.etc || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => {
                    setNewHuman({ ...newHuman, etc: e.target.value });
                  }} />
                </div>
              </>}
              {action === ACTION.RATE && <>
                <table className="w-full mb-8">
                  <thead>
                    <tr>
                      <th className="text-left font-bold text-gray-700">평가 항목</th>
                      <td>
                        <div className="grid grid-cols-5 gap-1">
                          <div className="flex justify-center">1</div>
                          <div className="flex justify-center">2</div>
                          <div className="flex justify-center">3</div>
                          <div className="flex justify-center">4</div>
                          <div className="flex justify-center">5</div>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingList.map((r, ridx) => <tr key={r.key}>
                      <td className={`text-left text-gray-700 ${(ridx + 1) % 2 == 0 ? 'bg-gray-100' : ''}`}>{r.name}</td>
                      <td className={`${(ridx + 1) % 2 == 0 ? 'bg-gray-100' : ''}`}>
                        <div className="grid grid-cols-5 gap-1">
                          {[...Array(5)].map((a, idx) => <div className="flex justify-center" key={idx}>
                            <input type="radio" value={idx + 1} name={r.key} onChange={e => setRate({ ...rate, [r.key]: parseInt(e.target.value) })}
                              checked={rate[r.key] === (idx + 1) ? true : false} />
                          </div>)}
                        </div>
                      </td>
                    </tr>)}
                    <tr className="pt-3">
                      <td className="text-left text-gray-700">한줄평</td>
                      <td>
                        <input type="text" id="comment" value={rate.comment || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => {
                          setRate({ ...rate, comment: e.target.value });
                        }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>}
            </div>
            {/*  Modal footer */}
            {action === ACTION.VIEW && human && <div className="flex justify-between items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={e => {
                  ;
                  setAction(ACTION.RATE);
                }}>평가</button>
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={e => {
                  setNewHuman(human);
                  setAction(ACTION.MOD);
                }}
              >수정</button>
            </div>}
            {action === ACTION.REG && <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={e => create()}>등록</button>
            </div>
            }
            {action === ACTION.MOD && <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={e => update()}>수정</button>
            </div>
            }
            {action === ACTION.RATE && <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={e => rating()}>평가</button>
            </div>
            }
          </div>
        </div>
      </div>


      <div className="bg-white shadow-md rounded-md overflow-hidden max-w-lg mx-auto mt-1">

        <div className="py-2 px-4 flex justify-between">
          <h1><Image
            className="mx-auto h-10 w-auto"
            src="/logo.png"
            alt="평가 시스템"
            width={100}
            height={100}
          /></h1>
          <button
            className="flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={(e) => {
              if (logout) logout();
              router.push('/');
            }}
          >
            로그아웃
          </button>
        </div>

        <div className="bg-gray-100 py-2 px-4 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800">평가 대상 목록</h2>

          <button
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={(e) => {
              setHuman(undefined);
              setAction(ACTION.REG);
              setModalShow(true);
            }}
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
                  <ImageFallback
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    src={`https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${data.id}/${data.photo}?thumb=50x50`}
                    alt="User avatar"
                    width={50}
                    height={50}
                    fallbackSrc="/avatar.png"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {data.name}
                      <span className="text-sm">
                        &nbsp;{data.average} ({data.cnt || 0})
                      </span>
                    </h3>

                    <span className="text-gray-600 text-base">
                      <div className="flex items-center space-x-1">
                        {rateUi(Math.round(data.average))}{" "}
                      </div>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={(e) => {
                      setHuman(data);
                      setAction(ACTION.RATE);
                      setModalShow(true);
                    }}
                  >
                    평가
                  </button>
                  <button
                    type="button"
                    className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-3"
                    onClick={(e) => {
                      setHuman(data);
                      setAction(ACTION.VIEW);
                      setModalShow(true);
                    }}
                  >
                    상세
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
