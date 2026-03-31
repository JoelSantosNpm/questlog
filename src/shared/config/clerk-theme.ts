import { dark } from '@clerk/themes'

export const darkTheme = {
  baseTheme: dark,
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    socialButtonsVariant: 'iconButton' as const,
  },
  variables: {
    colorPrimary: '#f59e0b', // amber-500
    colorText: '#e7e5e4', // stone-200
    colorBackground: '#1c1917', // stone-900 (was stone-950)
    colorInputBackground: '#0c0a09', // stone-950 (was stone-900 - swap for input contrast)
    colorInputText: '#e7e5e4', // stone-200
    colorTextOnPrimaryBackground: '#0c0a09', // stone-950
    borderRadius: '0.25rem',
  },
  elements: {
    card: {
      backgroundColor: '#1c1917', // stone-900
      border: '1px solid #ca8a04', // amber-600 (stronger contrast)
      boxShadow: '0 0 20px -5px rgba(202, 138, 4, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.5)', // glowing amber shadow
    },
    headerTitle: {
      color: '#f59e0b', // amber-500
    },
    headerSubtitle: {
      color: '#a8a29e', // stone-400
    },
    formButtonPrimary: {
      backgroundColor: '#f59e0b', // amber-500
      color: '#0c0a09', // stone-950
      '&:hover': {
        backgroundColor: '#d97706', // amber-600
      },
      textTransform: 'none',
    },
    formFieldInput: {
      backgroundColor: '#1c1917', // stone-900
      borderColor: '#44403c', // stone-700
      color: '#e7e5e4', // stone-200
      '&:focus': {
        borderColor: '#f59e0b', // amber-500
        boxShadow: 'none',
      },
    },
    footerActionLink: {
      color: '#f59e0b', // amber-500
      '&:hover': {
        color: '#d97706', // amber-600
      },
    },
    dividerLine: {
      backgroundColor: '#44403c', // stone-700
    },
    dividerText: {
      color: '#a8a29e', // stone-400
    },
    socialButtonsIconButton: {
      backgroundColor: '#1c1917', // stone-900
      border: '1px solid #44403c', // stone-700
      '&:hover': {
        backgroundColor: '#292524', // stone-800
      },
    },
  },
}
