'use client'
export function useToast() {
  return {
    toast: ({ title, description }: any) => {
      // minimal toast: console log
      console.log('[toast]', title, description)
      alert(title + '\n' + (description || ''))
    },
  }
}
