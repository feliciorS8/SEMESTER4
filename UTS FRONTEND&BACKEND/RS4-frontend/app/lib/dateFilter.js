export function buildDateFilter(searchParams, columnName = 'tanggal_reservasi') {
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const clauses = [];
    const params = [];

    if (from) {
        clauses.push(`DATE(${columnName}) >= ?`);
        params.push(from);
    }

    if (to) {
        clauses.push(`DATE(${columnName}) <= ?`);
        params.push(to);
    }

    return { clauses, params, from, to };
}
