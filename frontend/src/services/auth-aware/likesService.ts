import AuthAware from "./AuthAware";
import type Like from "../../models/Like";

export default class LikesService extends AuthAware {

    async getLikes(): Promise<string[]> {
        const { data } = await this.axiosInstance<string[]>('/likes');
        return data;
    }


    async like(vacationId: string): Promise<Like> {
        const { data } = await this.axiosInstance.post<Like>(
            `/likes/${vacationId}`
        )
        return data
    }

    async unlike(vacationId: string): Promise<Like> {
        const { data } = await this.axiosInstance.delete<Like>(
            `/likes/${vacationId}`
        )
        return data
    }
}
