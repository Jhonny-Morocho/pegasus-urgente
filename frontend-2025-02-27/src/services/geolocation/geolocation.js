import { onUnmounted, onMounted, ref } from 'vue'

export function useGeolocation () {
  const coords = ref({ latitude: -33.444324109274156, longitude: -70.65356921284484 })
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let watcher = null
  onMounted(() => {
    if (isSupported) {
      setTimeout(() => {
        watcher = navigator.geolocation.watchPosition(
          (position) => (coords.value = position.coords)
        )
      }, 100)
    }
  })
  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher)
  })

  return { coords, isSupported }
}
