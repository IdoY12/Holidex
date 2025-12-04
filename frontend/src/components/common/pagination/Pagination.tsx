import { useAppDispatcher, useAppSelector } from "../../../redux/hooks";
import { setPage } from "../../../redux/vacations-slice";
import "./Pagination.css"


export default function Pagination() {
    const dispatch = useAppDispatcher();
    const page = useAppSelector(state => state.vacationsSlice.page);
    const totalPages = useAppSelector(state => state.vacationsSlice.totalPages);

    if (totalPages === 0) return null;

    const go = (num: number) => {
        dispatch(setPage(num));
    };

    const p1 = 1;
    const p2 = page - 1 > 1 ? page - 1 : null;
    const p3 = page;
    const p4 = page + 1 < totalPages ? page + 1 : null;
    const p5 = totalPages;

    return (
        <div className="pagination flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => page > 1 && go(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
            >
                ← Previous
            </button>

            <div className="flex gap-2">
                <button
                    onClick={() => go(p1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === p1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    {p1}
                </button>

                {page > 3 && <span className="px-3 py-2 text-gray-400">...</span>}

                {p2 && p2 !== p1 && (
                    <button
                        onClick={() => go(p2)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === p2 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p2}
                    </button>
                )}

                {p3 !== p1 && p3 !== p5 && (
                    <button
                        onClick={() => go(p3)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === p3 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p3}
                    </button>
                )}

                {p4 && p4 !== p5 && (
                    <button
                        onClick={() => go(p4)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === p4 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p4}
                    </button>
                )}

                {page < totalPages - 2 && <span className="px-3 py-2 text-gray-400">...</span>}

                {p5 !== p1 && (
                    <button
                        onClick={() => go(p5)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === p5 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p5}
                    </button>
                )}
            </div>

            <button
                onClick={() => page < totalPages && go(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
            >
                Next →
            </button>
        </div>
    );
}
