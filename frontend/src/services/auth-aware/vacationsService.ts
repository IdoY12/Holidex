import AuthAware from "./AuthAware";
import type Vacation from "../../models/Vacation";
import type VacationDraft from "../../models/VacationDraft";

export default class VacationsService extends AuthAware {

    async getVacations(): Promise<Vacation[]> {
        const { data } = await this.axiosInstance.get<Vacation[]>('/vacations')
        return data
    }

    async createVacation(draft: VacationDraft): Promise<Vacation> {
        const formData = this.preparePayload(draft)

        const { data } = await this.axiosInstance.post<Vacation>(
            '/vacations',
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )

        return data
    }

    async updateVacation(id: string, draft: VacationDraft): Promise<Vacation> {
        const formData = this.preparePayload(draft)

        const { data } = await this.axiosInstance.put<Vacation>(
            `/vacations/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )
        return data
    }

    async deleteVacation(id: string): Promise<boolean> {
        const { data } = await this.axiosInstance.delete(`/vacations/${id}`)
        return data
    }

    private preparePayload(draft: VacationDraft): FormData {
        const formData = new FormData()
        
        formData.append("destination", draft.destination)
        formData.append("description", draft.description)
        formData.append("startDate", draft.startDate)
        formData.append("endDate", draft.endDate)
        formData.append("price", draft.price.toString())
        if(draft.image) {
            formData.append("image", draft.image)
        } 

        return formData
    }
}
