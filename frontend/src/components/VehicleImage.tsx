import { useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react'
import { resolveImageUrl, vehicleImageVariantUrl } from '../api/vehicles'

type VehicleImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  variant: 'cards' | 'thumbs'
}

export const VehicleImage = ({ src, variant, onError, width, height, ...props }: VehicleImageProps) => {
  const originalUrl = resolveImageUrl(src)
  const variantUrl = vehicleImageVariantUrl(src, variant)
  const [failedVariantUrl, setFailedVariantUrl] = useState<string | null>(null)
  const currentUrl = failedVariantUrl === variantUrl ? originalUrl : variantUrl
  const fallbackDimensions = variant === 'cards' ? { width: 800, height: 533 } : { width: 480, height: 320 }

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (currentUrl !== originalUrl) {
      setFailedVariantUrl(variantUrl)
      return
    }
    onError?.(event)
  }

  return (
    <img
      {...props}
      src={currentUrl}
      width={width ?? fallbackDimensions.width}
      height={height ?? fallbackDimensions.height}
      onError={handleError}
    />
  )
}
