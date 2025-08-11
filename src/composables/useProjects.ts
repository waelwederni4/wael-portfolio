import { reactive } from 'vue'
import type { Project } from '@/types'

const state = reactive<{ loading: boolean; items: Project[] }>({
  loading: false, items: []
})
const base = import.meta.env.BASE_URL

async function loadAll() {
  if (state.items.length) return
  state.loading = true
  try {
    const res  = await fetch(`${base}projects/index.json`, { cache: 'no-cache' })
    const data = await res.json()
    state.items = (data.items || []) as Project[]
  } finally {
    state.loading = false
  }
}

export function useProjects(){
  return { state, loadAll }
}
