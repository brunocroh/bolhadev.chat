import * as Icons from 'lucide-react-native'
import { cssInterop } from 'nativewind'

function interopIcon(icon: Icons.LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  })
}

Object.values(Icons).forEach((icon) => interopIcon(icon as Icons.LucideIcon))

// interopIcon(AlertCircle)
// interopIcon(CheckCircle)
// interopIcon(XCircle)

// export { AlertCircle, CheckCircle, XCircle }
