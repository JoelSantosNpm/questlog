import { sileo } from 'sileo'

export const testSuccessToast = () => {
  sileo.success({
    title: 'Hechizo Exitoso',
    description: 'La magia fluye correctamente a través de los nodos.',
  })
}

export const testErrorToast = () => {
  sileo.error({
    title: 'Anomalía Mágica',
    description: 'Las líneas ley están interrumpidas. Fallo crítico al invocar.',
  })
}
