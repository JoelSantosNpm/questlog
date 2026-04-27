import { sileo } from 'sileo'

export const notifyCampaignCreation = async <T>(promise: Promise<T>) => {
  return sileo.promise(promise, {
    loading: {
      title: 'Canalizando magia...',
      description: 'Invocando el portal hacia tu nuevo mundo.',
    },
    success: {
      title: 'Portal Esculpido',
      description: 'Las runas han sido escritas y el portal está abierto.',
    },
    error: (err) => ({
      title: 'Fallo al esculpir',
      description:
        err instanceof Error ? err.message : 'Magia inestable. Inténtalo de nuevo más tarde.',
    }),
  })
}
