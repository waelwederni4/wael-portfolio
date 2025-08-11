import { ref } from 'vue'

interface State {
  loading: boolean
  items: any[]
}

const state = ref<State>({ loading: false, items: [] })

export function useProjects() {
  async function loadAll() {
    if (state.value.items.length || state.value.loading) return
    state.value.loading = true
    try {
      const url = `${import.meta.env.BASE_URL}projects/index.json`   
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
      const data = await res.json()
      state.value.items = data.items || []
    } finally {
      state.value.loading = false
    }
  }
  return { state, loadAll }
}
