import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n/index'
import '@/styles/theme.css'
import '@/styles/style.css'
import { applyMobileVhVar } from '@/utils/mobileVh'

applyMobileVhVar();
function setAppVH(){
  const set = () => {
    document.documentElement.style.setProperty('--app-vh', `${window.innerHeight / 100}px`)
  }
  set()
  window.addEventListener('resize', set)
  window.addEventListener('orientationchange', set)
}
setAppVH()
createApp(App).use(i18n).mount('#app')

