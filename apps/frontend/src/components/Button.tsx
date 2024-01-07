import { extendsVariants } from '@/utils/variants'
import { Button as NextUIButton } from '@nextui-org/button'

const Button = extendsVariants(NextUIButton, {
  "filled": {
    className: "text-white rounded-lg",
    colors: {
      "primary": [
        "bg-indigo-500",
        "data-[disabled=true]:bg-gray-500",
        "data-[hover=true]:bg-indigo-600"
      ],
      "secondary": [
        "bg-indigo-300 text-indigo-500",
        "data-[disabled=true]:bg-gray-400 data-[disabled=true]:text-gray-600",
        "data-[hover=true]:bg-indigo-400 data-[hover=true]:text-white"
      ]
    }
  },
  "outlined": {
    className: "rounded-lg",
    colors: {
      "primary": [
        "bg-white border border-indigo-500 text-indigo-500 border-[2px]",
        "data-[disabled=true]:border-gray-500 data-[disabled=true]:text-gray-500",
        "data-[hover=true]:border-indigo-600 data-[hover=true]:text-indigo-600",
      ],
    }
  },
  "plain": {
    props: {
      disableAnimation: true,
    },
    className: "p-0 h-auto",
    colors: {
      "primary": [
        "text-indigo-500 bg-transparent underline underline-offset-4",
        "data-[disabled=true]:text-gray-600",
        "data-[hover=true]:text-indigo-600"
      ],
    }
  },
}, {
  defaultVariant: "filled",
  defaultColor: "primary",
})

export default Button