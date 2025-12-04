import { useNavigate } from "react-router-dom";
import useService from "../../../../hooks/use-service";
import VacationsService from "../../../../services/auth-aware/vacationsService";
import { useAppDispatcher } from "../../../../redux/hooks";
import { addVacation } from "../../../../redux/vacations-slice";
import VacationForm from "../vacation-form/VacationForm";
import type VacationDraft from "../../../../models/VacationDraft";
import type Vacation from "../../../../models/Vacation";
import useTitle from "../../../../hooks/use-title";

export default function AddVacation() {
    const navigate = useNavigate();
    const dispatch = useAppDispatcher();
    const vacationsService = useService(VacationsService);

    useTitle("Post Vacations")

    async function handleCreate(draft: VacationDraft): Promise<void> {

        const created: Vacation = await vacationsService.createVacation(draft)

        dispatch(addVacation(created))
        navigate("/admin")
    }

    return (
        <VacationForm
            onSubmit={handleCreate}
            onCancel={ () => navigate("/admin") }
        />
    )
}
