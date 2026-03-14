import { useEffect, useRef, useState } from "react";
import { useAppDispatcher, useAppSelector } from "../../../redux/hooks";
import VacationsService from "../../../services/auth-aware/vacationsService";
import useService from "../../../hooks/use-service";
import LikesService from "../../../services/auth-aware/likesService";
import { init } from "../../../redux/vacations-slice";
import { initLikes } from "../../../redux/likes-slice";
import FilterBar from "../filter-bar/FilterBar";
import VacationGrid from "../vacation-grid/VacationGrid";
import Pagination from "../pagination/Pagination";
import useTitle from "../../../hooks/use-title";
import "./VacationsPage.css";

interface VacationsPageProps {
    isAdmin: boolean;
}

export default function VacationsPage({ isAdmin }: VacationsPageProps) {
    const dispatch = useAppDispatcher();
    const vacationsService = useService(VacationsService);
    const likesService = useService(LikesService);
    const topRef = useRef<HTMLDivElement | null>(null);
    const page = useAppSelector(state => state.vacationsSlice.page);
    const [loadError, setLoadError] = useState<string | null>(null);

    useTitle("Vacations");

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [page]);

    useEffect(() => {
        setLoadError(null);
        vacationsService.getVacations()
            .then(data => dispatch(init(data)))
            .catch(() => setLoadError("Could not load vacations. Please refresh and try again."));

        if (!isAdmin) {
            likesService.getLikes()
                .then(ids => dispatch(initLikes(ids)))
                .catch(() => setLoadError("Could not load likes. Please refresh and try again."));
        }
    }, [dispatch, isAdmin, likesService, vacationsService]);

    return (
        <div className="vacations-page" ref={topRef}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">
                        {isAdmin ? "Vacation Management" : "Vacations"}
                    </h1>
                </div>

                <FilterBar />
                {loadError && <p className="vacations-page__load-error">{loadError}</p>}
                <VacationGrid isAdmin={isAdmin} />
                <Pagination />
            </div>
        </div>
    );
}
