import { useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatcher } from "../../../redux/hooks";
import { VacationsFilter, setTotalPages } from "../../../redux/vacations-slice";
import VacationCard from "../vacation-card/VacationCard";
import AdminVacationCard from "../../admin/pages/admin-vacation-card/AdminVacationCard";
import "./VacationGrid.css"

const ITEMS_PER_PAGE = 12;

interface VacationGridProps {
    isAdmin: boolean;
}

export default function VacationGrid({ isAdmin }: VacationGridProps) {
    const dispatch = useAppDispatcher();
    const { vacations, filter, page } = useAppSelector(state => state.vacationsSlice);
    const { likedIds } = useAppSelector(state => state.likesSlice);

    const filteredVacations = useMemo(() => {
        const today = new Date();

        if (filter === VacationsFilter.LIKED) {
            return vacations.filter(v => likedIds.includes(v.id));
        }

        if (filter === VacationsFilter.UPCOMING) {
            return vacations.filter(v => {
                const start = new Date(v.startDate);
                return start > today;
            });
        }

        if (filter === VacationsFilter.ACTIVE) {
            return vacations.filter(v => {
                const start = new Date(v.startDate);
                const end = new Date(v.endDate);
                return start <= today && today <= end;
            });
        }

        return vacations;

    }, [vacations, likedIds, filter]);


    const paginatedVacations = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredVacations.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredVacations, page]);

    useEffect(() => {
        const total = Math.ceil(filteredVacations.length / ITEMS_PER_PAGE);
        dispatch(setTotalPages(total));
    }, [filteredVacations, dispatch]);

    if (paginatedVacations.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {filter === VacationsFilter.LIKED 
                    ? "No favorite vacations found"
                    : "No vacations found"}
            </div>
        );
    }

    return (
        <div className="vacation-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedVacations.map(vacation =>
                isAdmin ? (
                    <AdminVacationCard key={vacation.id} vacation={vacation} />
                ) : (
                    <VacationCard key={vacation.id} vacation={vacation} />
                )
            )}
        </div>
    );
}
