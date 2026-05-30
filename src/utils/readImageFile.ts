import { ACCEPTED_IMAGE_TYPES } from '../constants'
import { DEFAULT_SCREENSHOT_ADJUST } from '../model/defaults'
import type { ScreenshotSlot } from '../model/document'

const isAcceptedImage = (type: string): boolean =>
  (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type)

export const readScreenshotFile = (file: File): Promise<ScreenshotSlot> =>
  new Promise((resolve, reject) => {
    if (!isAcceptedImage(file.type)) {
      reject(new Error(`Unsupported image type: ${file.type || 'unknown'}`))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read image as data URL'))
        return
      }
      resolve({ dataUrl: result, fileName: file.name, adjust: DEFAULT_SCREENSHOT_ADJUST })
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
