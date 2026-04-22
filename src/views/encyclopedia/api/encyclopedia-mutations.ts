import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCharacterTemplate,
  createItemTemplate,
  createMonster,
  deleteCharacterTemplate,
  deleteItemTemplate,
  deleteMonster,
  updateCharacterTemplate,
  updateItemTemplate,
  updateMonster,
} from './actions'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

// Bestiary
export function useCreateMonster() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMonster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.bestiary() })
    },
  })
}
export function useUpdateMonster() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: Parameters<typeof updateMonster>) => updateMonster(args[0], args[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.bestiary() })
    },
  })
}
export function useDeleteMonster() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMonster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.bestiary() })
    },
  })
}

// Character Templates
export function useCreateCharacterTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCharacterTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.cast() })
    },
  })
}
export function useUpdateCharacterTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: Parameters<typeof updateCharacterTemplate>) =>
      updateCharacterTemplate(args[0], args[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.cast() })
    },
  })
}
export function useDeleteCharacterTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCharacterTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.cast() })
    },
  })
}

// Items (Museum)
export function useCreateItemTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createItemTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.museum() })
    },
  })
}
export function useUpdateItemTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: Parameters<typeof updateItemTemplate>) =>
      updateItemTemplate(args[0], args[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.museum() })
    },
  })
}
export function useDeleteItemTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteItemTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENCYCLOPEDIA_KEYS.museum() })
    },
  })
}
