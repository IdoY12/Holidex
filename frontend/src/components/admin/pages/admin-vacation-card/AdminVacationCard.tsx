import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type Vacation from "../../../../models/Vacation";
import { useAppDispatcher } from "../../../../redux/hooks";
import useService from "../../../../hooks/use-service";
import VacationsService from "../../../../services/auth-aware/vacationsService";
import { deleteVacation } from "../../../../redux/vacations-slice";
import "./AdminVacationCard.css"

interface AdminVacationCardProps {
    vacation: Vacation;
}

export default function AdminVacationCard({ vacation }: AdminVacationCardProps) {
    const dispatch = useAppDispatcher();
    const navigate = useNavigate();
    const vacationsService = useService(VacationsService);

    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleDelete = async () => {
        if (!confirm(`Delete "${vacation.destination}"?`)) return;

        setIsDeleting(true)
        try {
            await vacationsService.deleteVacation(vacation.id);
            dispatch(deleteVacation(vacation.id));
        } catch {
            alert("Failed to delete vacation");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/edit/${vacation.id}`);
    };

    return (
        <div className="admin-vacation-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-blue-200">
            <div className="relative h-48 bg-gray-200">
                {loading && (
                    <div className="spinner-wrapper">
                        <div className="spinner-circle"></div>
                    </div>
                )}

                {vacation.imageUrl && (
                    <img
                        src={vacation.imageUrl}
                        alt={vacation.destination}
                        className="w-full h-full object-cover"
                        onLoad={() => setLoading(false)}
                    />
                )}

                <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    ADMIN
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{vacation.destination}</h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {vacation.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>Start Date <br/>{new Date(vacation.startDate).toLocaleDateString("he-IL")}</span>
                    <span>-</span>
                    <span>End Date <br/>{new Date(vacation.endDate).toLocaleDateString("he-IL")}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-600">
                        ₪{vacation.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span>❤️</span>
                        <span>{vacation.likes} likes</span>
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleEdit}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                            isDeleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
