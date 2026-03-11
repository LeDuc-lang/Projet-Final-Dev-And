import { createTamagui, createFont } from 'tamagui'

// Define a basic font
const defaultFont = createFont({
  family: 'System',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 30,
    10: 46,
    true: 14,
  },
  lineHeight: {
    1: 17,
    2: 22,
    3: 25,
    4: 20,
    5: 22,
    6: 24,
    7: 28,
    8: 32,
    9: 38,
    10: 52,
    true: 22,
  },
  weight: {
    4: '300',
    6: '400',
    7: '700',
    true: '400',
  },
  letterSpacing: {
    4: 0,
    8: 0,
    true: 0,
  },
})

const config = createTamagui({
  fonts: {
    body: defaultFont,
    heading: defaultFont,
  },
  themes: {
    light: {
      background: '#fff',
      color: '#000',
    },
    dark: {
      background: '#000',
      color: '#fff',
    },
  },
  tokens: {
    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      true: 16,
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      true: 16,
    },
    radius: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
    },
    zIndex: {
      0: 0,
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 500,
    },
    color: {},
  },
  shorthands: {
    px: 'paddingHorizontal',
    py: 'paddingVertical',
  } as const,
})

export default config