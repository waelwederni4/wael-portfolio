import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  // “virtual” section routes (optional nice URLs like #/about)
  { path: '/about',    name: 'about',    component: Home, meta: { scrollTo: '#about' } },
  { path: '/exp',      name: 'exp',      component: Home, meta: { scrollTo: '#exp' } },
  { path: '/projects', name: 'projects', component: Home, meta: { scrollTo: '#projects' } },
  { path: '/contact',  name: 'contact',  component: Home, meta: { scrollTo: '#contact' } },
  // deep link to a project (opens modal inside Home)
  { path: '/project/:type/:slug', name: 'project', component: Home }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }

    // keep scroll if only query changed on same path
    const toPath = to.fullPath.split('?')[0]
    const fromPath = from.fullPath.split('?')[0]
    if (toPath === fromPath) return false

    const section = (to.meta as any)?.scrollTo
    if (section) return { el: section, behavior: 'smooth' }

    return { top: 0 }
  }
})
