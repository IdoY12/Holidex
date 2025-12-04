import { useLocation } from "react-router-dom";
import { useAppDispatcher, useAppSelector } from "../../../redux/hooks";
import { setFilter, VacationsFilter } from "../../../redux/vacations-slice";
import "./FilterBar.css"

export default function FilterBar() {
    const dispatch = useAppDispatcher();
    const filter = useAppSelector(state => state.vacationsSlice.filter);
    const location = useLocation();

    const isAdmin = location.pathname.startsWith("/admin");

    const handleFilterChange = (value: VacationsFilter) => {
        dispatch(setFilter(value));
    };

    const filters = isAdmin 
        ? [
            { value: VacationsFilter.ALL, label: "All", icon: "🌍" }
          ]
        : [
            { value: VacationsFilter.ALL, label: "All", icon: "🌍" },
            { value: VacationsFilter.LIKED, label: "Favorites", icon: "❤️" },
            { value: VacationsFilter.UPCOMING, label: "Upcoming", icon: "⏳" },
            { value: VacationsFilter.ACTIVE, label: "Active", icon: "🔥" }
          ];

    return (
        <div className="filter-bar mb-6">
            <div className="flex gap-2">
                {filters.map(f => (
                    <button
                        key={f.value}
                        onClick={() => handleFilterChange(f.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            filter === f.value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        <span>{f.icon}</span>
                        <span>{f.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
