import AuthAware from "./AuthAware";
import type ReportGraph from "../../models/ReportGraph";

export default class ReportsService extends AuthAware {

    async getReports(): Promise<ReportGraph[]> {
        const { data } = await this.axiosInstance<ReportGraph[]>('/reports')
        return data
    }

    async downloadCsv() {
        const { data } = await this.axiosInstance('/reports/csv', { responseType: 'blob' })

        const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'vacations-likes.csv'
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)

        URL.revokeObjectURL(url)
    }
}