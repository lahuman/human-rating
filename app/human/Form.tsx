import { useEffect, useState } from "react";
import { Human } from "./page";
import ImageFallback from "./ImageFallback";

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
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          이름
        </label>
        <input
          type="text"
          id="name"
          value={newHuman.name || ""}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          placeholder="이름을 입력하세요"
          onChange={(e) => {
            setNewHuman({ ...newHuman, name: e.target.value });
          }}
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="file_input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          사진
        </label>
        <div className="flex items-center">
          <ImageFallback
            className="w-24 h-24 rounded-lg object-cover mr-4"
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
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
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
            <p className="mt-1 text-sm text-gray-500" id="file_input_help">
              SVG, PNG, JPG 또는 GIF 파일을 업로드하세요.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="birthDate"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          생년월일
        </label>
        <input
          type="text"
          maxLength={8}
          id="birthDate"
          value={newHuman.birth_date || ""}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          placeholder="YYYYMMDD 형식으로 입력하세요"
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
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          성별
        </label>
        <select
          id="sex"
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
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
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          특징
        </label>
        <input
          type="text"
          id="etc"
          value={newHuman.etc || ""}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          placeholder="특징을 입력하세요"
          onChange={(e) => {
            setNewHuman({ ...newHuman, etc: e.target.value });
          }}
        />
      </div>
    </>
  );
}