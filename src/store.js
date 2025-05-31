import { proxy } from 'valtio'

const state = proxy({
  intro: false,
  colors: ['#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934', '#dafdaf'],
  decals: ['react_thumb.png', 'three2_thumb.png', 'pmndrs_thumb.png', 'texture-1.webp', 'rusted-1.jpg'],
  color: '#EFBD4E',
  decal: 'three2',
  heartShape: true
})

export { state }
