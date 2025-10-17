export interface ApiResponse<T> {
    code: number
    data: T
    error: boolean
    message: string
    status: string
}
