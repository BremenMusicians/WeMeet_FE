const fontGenerator = (weight: number, size: number) =>
    `
        font-weight: ${weight};
        font-size: ${size}px;
    `;

export const theme = {
    color: {
        gray950: "var(--gray950)",
        gray900: "var(--gray900)",
        gray800: "var(--gray800)",
        gray700: "var(--gray700)",
        gray600: "var(--gray600)",
        gray500: "var(--gray500)",
        gray400: "var(--gray400)",
        gray300: "var(--gray300)",
        gray200: "var(--gray200)",
        gray100: "var(--gray100)",
        gray50: "var(--gray50)",
        orange900: "var(--orange900)",
        orange800: "var(--orange800)",
        orange700: "var(--orange700)",
        orange600: "var(--orange600)",
        orange500: "var(--orange500)",
        orange400: "var(--orange400)",
        orange300: "var(--orange300)",
        orange200: "var(--orange200)",
        orange100: "var(--orange100)",
        orange50: "var(--orange50)",
    },
    font: {
        header1: fontGenerator(700, 32),
        header2: fontGenerator(500, 30),
        header3: fontGenerator(300, 28),
        title1: fontGenerator(500, 24),
        title2: fontGenerator(500, 22),
        title3: fontGenerator(300, 20),
        body1: fontGenerator(500, 18),
        body2: fontGenerator(400, 18),
        body3: fontGenerator(500, 16),
        body4: fontGenerator(400, 16),
        body5: fontGenerator(500, 14),
        body6: fontGenerator(400, 14),
    }
} as const;

export type fontKeyOfType = keyof typeof theme.font;
