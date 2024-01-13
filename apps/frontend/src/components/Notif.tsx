import { createVariants, pickVariant } from "@/utils/variants"

import { FiPaperclip } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6"
import { RxCross1 } from "react-icons/rx"
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const notifVariants = createVariants({
  'file': {
    props: {
      icon: <FiPaperclip size={20} className="text-indigo-500" />
    },
    colors: {
      primary: {
        base: 'border-indigo-500',
        iconContainer: "bg-indigo-300"
      }
    }
  },
  'booking': {
    props: {
      icon: <IoBookmarkOutline size={20} className="text-pink-500" />
    },
    colors: {
      primary: {
        base: 'border-pink-500',
        iconContainer: "bg-pink-400"
      }
    }
  },
  'info': {
    props: {
      icon: <IoInformationCircleOutline size={20} className="text-indigo-500" />
    },
    colors: {
      primary: {
        base: 'border-indigo-500',
        iconContainer: "bg-indigo-300"
      }
    }
  },
  'warning': {
    props: {
      icon: <IoInformationCircleOutline size={20} className="text-indigo-500" />
    },
    colors: {
      primary: ""
    }
  },
  'error': {
    props: {
      icon: <RxCross1 size={20} className="text-white" />
    },
    colors: {
      primary: {
        base: 'border-danger',
        iconContainer: "bg-danger"
      }
    }
  },
  'success': {
    props: {
      icon: <FaCheck size={20} className="text-white" />
    },
    colors: {
      primary: {
        base: 'border-success',
        iconContainer: "bg-success"
      }
    }
  },
})

export type NotifType = keyof typeof notifVariants

export type NotifProps = {
  type: NotifType
  title: string
  message?: string
  icon?: React.ReactNode
  onClose?: () => void
}


export default function Notif(props: NotifProps) {

  const {
    type,
    title,
    message,
    onClose
  } = props

  const {
    props: variantProps,
    classNames,
  } = pickVariant(notifVariants, type, 'primary')

  const icon = props.icon || variantProps?.icon

  return <div className={twMerge(classNames?.base, "max-w-[450px] bg-white shadow-md p-6 border-b-5")}>
    <div className={clsx("flex items-center justify-between gap-4", {
      "mb-4": !!message
    })}>
      <div className="flex items-center gap-2 min-w-[100px]">
        <div className={twMerge(
          "w-[32px] h-[32px] flex items-center justify-center rounded-full",
          classNames?.iconContainer
        )}
        >{icon}</div>
        <h4 className="font-bold">{title}</h4>
      </div>
      <RxCross1 onClick={onClose} className="text-indigo-500 cursor-pointer" size={20} />
    </div>
    {message && <p>{message}</p>}
  </div>


}