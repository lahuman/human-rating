import { useEffect, useState } from "react";
import { Human } from "./page";
import ImageFallback from "./ImageFallback";
import { RecordModel } from "pocketbase";

export default function Form({
  newHuman,
  setNewHuman,
}: {
  newHuman: Human;
  setNewHuman: (data: Human) => void;
}) {
  const [imgFile, setImgFile] = useState<any>(null);

  useEffect(() => {
    setImgFile(null);
  }, []);
  return (
    <>
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          이름
        </label>
        <input
          type="text"
          id="name"
          value={newHuman.name || ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            setNewHuman({ ...newHuman, name: e.target.value });
          }}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="file_input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          사진
        </label>
        <div className="flex items-center ">
          <ImageFallback
            className="w-12 h-12 rounded-full object-cover mr-4"
            src={
              imgFile
                ? imgFile
                : `https://lahuman.fly.dev/api/files/l11ys2bgupoutpf/${newHuman.id}/${newHuman.photo}?thumb=100x100`
            }
            alt="User avatar"
            width={100}
            height={100}
            fallbackSrc="/avatar.png"
          />
          <div>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                var reader = new FileReader();
                if (event.target && event.target.files) {
                  reader.readAsDataURL(event.target.files[0]);
                  reader.onloadend = (event) => {
                    if (event.target && event.target.result) {
                      setImgFile(event.target.result);
                    }
                  };
                }
              }}
            />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="birthDate"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          생년월일
        </label>
        <input
          type="text"
          maxLength={8}
          id="birthDate"
          value={newHuman.birth_date || ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            setNewHuman({
              ...newHuman,
              birth_date: parseInt(e.target.value) || 0,
            });
          }}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="sex"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          성별
        </label>
        <select
          id="sex"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={newHuman.sex || "M"}
          onChange={(e) => {
            setNewHuman({ ...newHuman, sex: e.target.value });
          }}
        >
          <option value={"M"}>남</option>
          <option value={"F"}>여</option>
          <option value={"E"}>기타</option>
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="etc"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          특징
        </label>
        <input
          type="text"
          id="etc"
          value={newHuman.etc || ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => {
            setNewHuman({ ...newHuman, etc: e.target.value });
          }}
        />
      </div>
    </>
  );
}
