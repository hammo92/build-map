/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // './pages/**/*.{js,ts,jsx,tsx}',
        // './components/**/*.{js,ts,jsx,tsx}',
        // './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    100: '#B7B8C3',
                    200: '#8C8EA2',
                    300: '#6A6D88',
                    400: '#53556E',
                    500: '#40435A',
                    600: '#32344A',
                    700: '#26283D',
                    800: '#1E1F2C',
                    900: '#171821',
                },
            },
            fontFamily: {
                sans: 'relative-pro',
                mono: 'relative-mono',
            },
        },
    },
    plugins: [],
}
