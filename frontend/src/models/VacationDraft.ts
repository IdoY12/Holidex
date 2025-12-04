export default interface VacationDraft {
    destination: string
    startDate: string
    endDate: string
    price: number
    description: string
    image: File | null
}
