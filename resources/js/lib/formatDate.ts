// contoh input: 2026-08-24T04:39:27.000000Z
// contoh output: 2026-08-24 11:39

export function formatDateTime(isoString?: string | null): string {
    if (!isoString) {
        return '-';
    }

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    const pad = (n: number): string => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
