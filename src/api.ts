export const loadUser = (): Promise<unknown> => fetch(
    'https://randomuser.me/api',
    {
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
        },
    },
)
