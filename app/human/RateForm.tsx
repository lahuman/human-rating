import { Rate } from "./page";
import { ratingList } from "./rating";

export default function RateFormUI({ rate, setRate }: { rate: Rate, setRate: (data: Rate) => void }) {
    const handleRating = (key: string, value: number) => {
        setRate({ ...rate, [key]: value });
    };

    return (
        <div className="w-full p-4">
            {ratingList.map((item, index) => (
                <div key={item.key} className={`py-2 ${index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} flex items-center`}>
                    <div className="font-semibold text-[#333333] flex-1 text-sm">{item.name}</div>
                    <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleRating(item.key, idx + 1)}
                                className={`h-8 w-8 rounded-full focus:outline-none ${rate[item.key] > idx ? 'bg-[#F7E600] text-[#333333]' : 'bg-[#EDEDED] text-[#999999]'} hover:bg-[#F7D600] hover:text-[#333333]`}
                                aria-label={`Rate ${item.name} ${idx + 1} stars`}
                            >
                                ★ {/* Unicode star character */}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div className="py-4">
                <label htmlFor="comment" className="block font-semibold text-[#666666] text-sm mb-1">한줄평</label>
                <textarea
                    id="comment"
                    rows={3}
                    value={rate.comment || ""}
                    className="form-textarea mt-1 block w-full border-[#E0E0E0] rounded-md shadow-sm focus:border-[#F7E600] focus:ring focus:ring-[#F7E600] focus:ring-opacity-50 text-sm"
                    onChange={e => setRate({ ...rate, comment: e.target.value })}
                    placeholder="코멘트를 남겨주세요..."
                ></textarea>
            </div>
        </div>
    );
}
