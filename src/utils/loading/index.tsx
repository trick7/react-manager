// import ReactDOM from 'react-dom/client'
// import Loading from './loading'
import './loading.less'
let count = 0
//第一种方案创建的loading 的显示与隐藏
// export const showLoading = () => {
//   if (count === 0) {
//     const loading = document.createElement('div')
//     document.body.append(loading)
//     loading.setAttribute('id', 'loading')
//     ReactDOM.createRoot(loading).render(<Loading />)
//   }
//   count++
// }

// export const hideLoading = () => {
//   if (count < 0) return
//   count--
//   if (count === 0) document.body.removeChild(document.getElementById('loading') as HTMLDivElement)
// }
export const showLoading = () => {
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'flex')
  }
  count++
}
export const hideLoading = () => {
  count--
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'none')
  }
}
