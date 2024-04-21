import { Rate } from "./page";
import { ratingList } from "./rating";

export default function RateFormUI({ rate, setRate }: { rate: Rate, setRate: (data: Rate) => void }) {
    const handleRating = (key: string, value: number) => {
        setRate({ ...rate, [key]: value });
    };

    return (
        <div className="w-full p-4">
            {ratingList.map((item, index) => (
                <div key={item.key} className={`py-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} flex items-center`}>
                    <div className="font-semibold text-gray-800 flex-1">{item.name}</div>
                    <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleRating(item.key, idx + 1)}
                                className={`h-10 w-10 rounded-full ${rate[item.key] > idx ? 'text-yellow-500' : 'text-gray-400'}`}
                                aria-label={`Rate ${item.name} ${idx + 1} stars`}
                            >
                                &#9733; {/* Unicode star character */}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div className="py-4">
                <label htmlFor="comment" className="block font-semibold text-gray-700">한줄평</label>
                <textarea
                    id="comment"
                    rows={3}
                    value={rate.comment || ""}
                    className="form-textarea mt-1 block w-full border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    onChange={e => setRate({ ...rate, comment: e.target.value })}
                ></textarea>
            </div>
        </div>
    );
}
