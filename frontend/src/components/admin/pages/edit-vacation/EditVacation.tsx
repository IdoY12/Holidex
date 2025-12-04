import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatcher } from "../../../../redux/hooks";
import useService from "../../../../hooks/use-service";
import VacationsService from "../../../../services/auth-aware/vacationsService";
import { updateVacation } from "../../../../redux/vacations-slice";
import VacationForm from "../vacation-form/VacationForm";
import type VacationDraft from "../../../../models/VacationDraft";
import useTitle from "../../../../hooks/use-title";

export default function EditVacation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatcher();
    const vacationsService = useService(VacationsService);

    useTitle("Edit Vacations")

    const vacation = useAppSelector(state => state.vacationsSlice.vacations.find(v => v.id === id))

    if (!vacation) return <p>Not found</p>;

    function handleUpdate(draft: VacationDraft) {
        return vacationsService.updateVacation(id!, draft)
            .then(updated => {
                dispatch(updateVacation(updated));
                navigate("/admin");
            });
    }

    return (
        <VacationForm
            vacation={vacation}
            onSubmit={handleUpdate}
            onCancel={function () { navigate("/admin"); }}
        />
    );
}
