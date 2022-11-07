import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const Waline = (props) => {
  const walineInstanceRef = React.useRef(null)
  const containerRef = React.createRef()
  const router = useRouter()

  const updateWaline = url => {
    walineInstanceRef.current?.update(props)
  }

  React.useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      serverURL: BLOG.comment.waline.serverUrl
    })
    router.events.on('routeChangeComplete', updateWaline)

    const anchor = window.location.hash
    if (anchor) {
      const targetNode = document.getElementsByClassName('wl-cards')[0]

      const mutationCallback = (mutations) => {
        for (const mutation of mutations) {
          const type = mutation.type
          if (type === 'childList') {
            const anchorElement = document.getElementById(anchor.substring(1))
            if (anchorElement && anchorElement.className === 'wl-item') {
              anchorElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
              setTimeout(() => {
                anchorElement.classList.add('animate__animated')
                anchorElement.classList.add('animate__bounceInRight')
                observer.disconnect()
              }, 300)
            }
          }
        }
      }

      const observer = new MutationObserver(mutationCallback)
      observer.observe(targetNode, { childList: true })
    }

    return () => {
      walineInstanceRef.current?.destroy()
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  return <div ref={containerRef} />
}

export default Waline
