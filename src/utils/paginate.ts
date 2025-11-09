export function paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
) {
    return {
        data: data,
        pagination: {
            total,
            page,
            limit,
        },
    };
}
