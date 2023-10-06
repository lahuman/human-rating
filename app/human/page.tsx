"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pb from "../pb";
import { RecordModel } from "pocketbase";
import ImageFallback from "./ImageFallback";
import { useAuth } from "@/context/AuthContext";
import RateUI from "./StarUI";
import View from "./View";
import Form from "./Form";
import RateFormUI from "./RateForm";
import { emptyRate, ratingList } from "./rating";
import { useLoad } from "@/context/LoadContext";
import LoaddingUI from "../Loadding";

enum ACTION {
  REG = "REG",
  MOD = "MOD",
  VIEW = "VIEW",
  RATE = "RATE"
}

export interface Human {
  id?: string;
  name?: string;
  birth_date?: number;
  sex?: string;
  etc?: string;
  photo?: string;
}

export interface Rate {
  [key: string]: any;
  management: number;
  passion: number;
  communication: number;
  proferssional: number;
  ethical: number;
  global: number;
  comment: string;
  human_id?: string;
}

export default function Human() {
  const router = useRouter();
  const { logout } = useAuth();
  const [list, setList] = useState<RecordModel[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [human, setHuman] = useState<RecordModel>();
  const [action, setAction] = useState<ACTION>(ACTION.REG);
  const [newHuman, setNewHuman] = useState<Human>({});
  const [rate, setRate] = useState<Rate>(emptyRate);
  const { setLoading, loading } = useLoad();

  function getList() {
    setLoading(true);
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
            setLoading(false);
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
        formData.append("user_id", pb.authStore.model?.id);
        formData.append("photo", selectedFile);
        return formData;
      } else {
        return { ...newHuman, sex: newHuman.sex || "M", user_id: pb.authStore.model?.id };
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
      setLoading(true);
      await pb.collection('human_info').update(String(newHuman?.id), data);
      resetForm();
    }
  }
  async function create() {
    try {
      const data = validNMakeData();
      if (data) {
        setLoading(true);
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

    setLoading(true);
    await pb.collection('human_rating').create({
      ...rate,
      human_id: human?.id,
      reg_user: pb.authStore.model?.id
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
          <div className="relative bg-white rounded-lg shadow ">
            {/*  Modal header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                {human && `${human.name}의`} 평가 상세
              </h3>
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center "
                onClick={e => setModalShow(false)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*  Modal body */}
            <div className="p-6 space-y-6">
              {action === ACTION.VIEW && human && <View human={human} />}
              {(action === ACTION.REG || action === ACTION.MOD) && <Form newHuman={newHuman} setNewHuman={setNewHuman} />}
              {action === ACTION.RATE && <RateFormUI rate={rate} setRate={setRate} />}
            </div>
            {/*  Modal footer */}
            {action === ACTION.VIEW && human && <div className="flex justify-between items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                onClick={e => {
                  ;
                  setAction(ACTION.RATE);
                }}>평가</button>
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                onClick={e => {
                  setNewHuman(human);
                  setAction(ACTION.MOD);
                }}
              >수정</button>
            </div>}
            {action === ACTION.REG && <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                onClick={e => create()}>등록</button>
            </div>
            }
            {action === ACTION.MOD && <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                onClick={e => update()}>수정</button>
            </div>
            }
            {action === ACTION.RATE && <div className="flex justify-between items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button data-modal-hide="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                onClick={async e => {
                  if (human) {
                    const data = window.btoa(encodeURIComponent(`${human.id}|${human.name}|https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${human.id}/${human.photo}?thumb=50x50`));
                    try {
                      await navigator.clipboard.writeText(`https://human-rating.vercel.app/rate-form?data=${data}`);
                      alert('클립보드에 복사하였습니다.');
                    } catch (err) {
                      alert(`https://human-rating.vercel.app/rate-form?data=${data}`);
                    }
                  }
                }}>평가 요청</button>

              <button data-modal-hide="defaultModal" type="button" className="text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
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
              setNewHuman({});
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
                      <span className="cursor-pointer" onClick={(e) => {
                        setHuman(data);
                        setAction(ACTION.VIEW);
                        setModalShow(true);
                      }}>{data.name}</span>
                      <span className={`text-sm`}>
                        &nbsp;<span className={` ${data.average < 2 ? 'text-red-400' : data.average < 3 ? 'text-orange-400' : data.average < 4 ? 'text-blue-400' : 'text-green-400'}`}>
                          {data.average}</span>
                        ({data.cnt || 0})
                      </span>
                    </h3>

                    <span className="text-gray-600 text-base">
                      <div className="flex items-center space-x-1">
                        <RateUI score={Math.round(data.average)} />{" "}
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
                    className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
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
      {loading && <LoaddingUI />}
    </>
  );
}
