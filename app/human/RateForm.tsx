import { Rate } from "./page";
import { ratingList } from "./rating";

export default function RateFormUI({ rate, setRate }: { rate: Rate, setRate: (data: Rate) => void }) {
    return <>
        <table className="w-full mb-2">
            <thead>
                <tr className="bg-gray-300">
                    <th className="font-bold text-gray-700 flex justify-center">평가 항목</th>
                    <td>
                        <div className="grid grid-cols-5 gap-1">
                            <div className="flex justify-center text-xs">매우불만</div>
                            <div className="flex justify-center text-xs">불만</div>
                            <div className="flex justify-center text-xs">보통</div>
                            <div className="flex justify-center text-xs">만족</div>
                            <div className="flex justify-center text-xs">매우만족</div>
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                {ratingList.map((r, ridx) => <tr key={r.key} className={`${(ridx + 1) % 2 == 0 ? 'bg-gray-200' : ''}`}>
                    <td className={`text-gray-700 flex justify-center`}>{r.name}</td>
                    <td >
                        <div className="grid grid-cols-5 gap-1">
                            {[...Array(5)].map((a, idx) => <div className="flex justify-center" key={idx}>
                                <input type="radio" value={idx + 1} name={r.key} onChange={e => setRate({ ...rate, [r.key]: parseInt(e.target.value) })}
                                    checked={rate[r.key] === (idx + 1) ? true : false} />
                            </div>)}
                        </div>
                    </td>
                </tr>)}
                <tr>
                    <td className="flex items-center justify-center text-gray-700 ">한줄평</td>
                    <td>
                        <input type="text" id="comment" value={rate.comment || ""}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e => {
                                setRate({ ...rate, comment: e.target.value });
                            }} />
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}