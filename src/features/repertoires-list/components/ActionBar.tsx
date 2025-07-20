import PencilAltIcon from "@/features/common/utils/icons/pencilAlt"
import { PlayIcon, TrashIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import { useRepertoireStoreOperations } from "../hooks/useRepertoireStoreOperations"

function ActionBar({ rid }) {
  const { deleteRepertoire } = useRepertoireStoreOperations()
  return (
    <div className="flex items-center divide-x divide-gray-200 rounded-lg border border-gray-300/50 bg-gray-100">
      <div className="flex justify-center px-4">
        <Link
          className="pt-2 text-orange-800/40 hover:text-orange-500/90"
          href={{
            query: {
              rid: rid,
            },
            pathname: "/builder",
          }}
        >
          <span className="flex flex-col items-center">
            {/* Icon */}
            <PencilAltIcon />
            {/* Text */}
            <span className="mb-2 text-xs font-bold transition-all duration-200">
              Build
            </span>
            {/* Focus Dot */}
          </span>
        </Link>
      </div>
      {/* Item #3 Active */}
      <div className="flex justify-center px-4">
        <a
          href="#"
          className="pt-2 text-emerald-800/40 hover:text-emerald-500/80"
        >
          <span className="flex flex-col items-center">
            {/* Icon */}
            <PlayIcon />
            {/* Text */}
            <span className="mb-2 text-xs font-bold transition-all duration-200">
              Train
            </span>
            {/* Focus Dot */}
          </span>
        </a>
      </div>
      <div
        className="flex cursor-pointer justify-center px-3 text-red-500/50 hover:text-red-500"
        onClick={() => {
          deleteRepertoire(rid)
        }}
      >
        <span className="flex flex-col items-center pt-2">
          {/* Icon */}
          <TrashIcon />
          {/* Text */}
          <span className="mb-2 text-xs transition-all duration-200">
            Delete
          </span>
          {/* Focus Dot */}
        </span>
      </div>
    </div>
  )
}

export default ActionBar
