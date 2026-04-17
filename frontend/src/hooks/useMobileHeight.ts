import { useEffect } from "react"

export const useMobileHeight = () => {
  useEffect(() => {
    const syncHeight = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty(
          "--visual-height",
          `${window.visualViewport.height}px`
        )
      }
    }

    window.visualViewport?.addEventListener("resize", syncHeight)
    window.visualViewport?.addEventListener("scroll", syncHeight)
    syncHeight()

    return () => {
      window.visualViewport?.removeEventListener("resize", syncHeight)
      window.visualViewport?.removeEventListener("scroll", syncHeight)
    }
  }, [])
}
