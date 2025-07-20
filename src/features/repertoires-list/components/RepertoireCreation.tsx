import { useState } from "react"
import { Label, Radio, RadioGroup } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import ModalFooterButtonBar from "@/features/modals/components/ModalFooterButtonBar"

const colors = [
  {
    name: "White",
    value: "w",
  },
  {
    name: "Black",
    value: "b",
  },
] as const

type Inputs = {
  title?: string
  pgn?: string
}

// ✅ Add proper TypeScript interface for props
interface RepertoireCreationProps {
  cancelFunc: () => void
  createNewRepertoire: (
    color: string,
    title?: string,
    position?: string,
    pgn?: string,
  ) => Promise<any>
}

function RepertoireCreation({
  cancelFunc,
  createNewRepertoire,
}: RepertoireCreationProps) {
  const [color, setColor] = useState(colors[0])
  const { chess } = useChessProvider()
  const [state, setState] = useState<"toSubmit" | "processing" | "submitted">(
    "toSubmit",
  )
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")

  const validationSchema = Yup.object().shape({
    title: Yup.string().optional(),
    pgn: Yup.string()
      .optional()
      .test(
        "is-valid-pgn",
        (d) => `${d.path} is not a valid pgn`,
        (value) => {
          return !value || value === "" || chess.load_pgn(value)
        },
      ),
  })

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  })
  const hasErrors = Object.entries(errors).length !== 0

  // ✅ Add proper type for data parameter
  function onSubmit(data: Inputs) {
    // ✅ Handle disabled state in function logic
    if (!hasErrors && state === "toSubmit") {
      setState("processing")
      setProgress(10)
      setProgressMessage("Starting repertoire creation...")

      // Simulate progress updates during creation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 500)

      createNewRepertoire(color.value, data.title, undefined, data.pgn)
        .then((r) => {
          clearInterval(progressInterval)
          setProgress(100)
          setProgressMessage("Repertoire created successfully!")

          setTimeout(() => {
            setState("submitted")
            cancelFunc()
          }, 1000)
        })
        .catch((error) => {
          clearInterval(progressInterval)
          setState("toSubmit")
          setProgress(0)
          setProgressMessage("")
          // Error already handled by parent
        })
    }
    return false
  }

  // ✅ Handle cancel with disabled state logic
  const handleCancel = () => {
    if (state !== "processing") {
      cancelFunc()
    }
  }

  // ✅ Create custom submit handler that respects disabled state
  const handleFormSubmit = (e?: React.BaseSyntheticEvent) => {
    if (state === "processing") {
      e?.preventDefault()
      return Promise.resolve()
    }
    return handleSubmit(onSubmit)(e)
  }

  return (
    <>
      <div className="space-y-6 p-2">
        {/* ✅ Progress Indicator */}
        {state === "processing" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Creating Repertoire
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out dark:bg-blue-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Progress Message */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {progressMessage}
            </p>
          </div>
        )}

        {/* Color Selection - Responsive & No Stretching */}
        <div
          className={
            state === "processing" ? "opacity-50 pointer-events-none" : ""
          }
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-center">
            Choose your pieces
          </label>
          <RadioGroup value={color} onChange={setColor}>
            {/* ✅ Responsive container with proper overflow handling */}
            <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center items-center px-2 overflow-x-none">
              {colors.map((c) => (
                <Radio
                  key={c.name}
                  value={c}
                  className={({ checked }) =>
                    `${
                      checked
                        ? "ring-1 sm:ring-2 ring-blue-500 ring-offset-2 sm:ring-offset-4 ring-offset-white dark:ring-offset-gray-900 bg-white dark:bg-gray-800 border-2 border-blue-500 shadow-xl sm:shadow-2xl shadow-blue-500/30"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600"
                    } relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 cursor-pointer flex flex-col items-center gap-2 sm:gap-3 md:gap-4 transition-all duration-300 hover:transform hover:-translate-y-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] flex-shrink-0 group`
                  }
                >
                  {({ checked }) => (
                    <>
                      {/* ✅ Fixed Chess Pieces Container - No Stretching */}
                      <div
                        className={`
                relative p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0
                ${
                  checked
                    ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 shadow-inner"
                    : "bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600"
                }
              `}
                      >
                        <div className="flex gap-1 sm:gap-2 items-center justify-center">
                          {/* ✅ King - Fixed aspect ratio */}
                          <div
                            className={`transition-all duration-500 flex-shrink-0 ${
                              checked
                                ? "scale-110"
                                : "scale-100 group-hover:scale-105"
                            }`}
                          >
                            <img
                              src={`/chessPieces/${c.value}_K.svg`}
                              alt={`${c.name} King`}
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain drop-shadow-md"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                aspectRatio: "1/1",
                              }}
                            />
                          </div>
                          {/* ✅ Queen - Fixed aspect ratio */}
                          <div
                            className={`transition-all duration-500 flex-shrink-0 ${
                              checked
                                ? "scale-110"
                                : "scale-100 group-hover:scale-105"
                            }`}
                          >
                            <img
                              src={`/chessPieces/${c.value}_Q.svg`}
                              alt={`${c.name} Queen`}
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain drop-shadow-md"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                aspectRatio: "1/1",
                              }}
                            />
                          </div>
                        </div>

                        {/* Floating orb effect when selected */}
                        {checked && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                        )}
                      </div>

                      {/* ✅ Responsive Color Dot */}
                      <div
                        className={`
                  w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 flex-shrink-0
                  ${
                    c.value === "w"
                      ? "bg-white border-gray-400 shadow-md"
                      : "bg-gray-900 border-gray-600 shadow-md"
                  }
                  ${checked ? "scale-125 shadow-lg ring-1 sm:ring-2 ring-blue-300" : "scale-100"}
                `}
                      />

                      {/* ✅ Responsive Label */}
                      <span
                        className={`text-xs sm:text-sm font-semibold transition-all duration-300 text-center leading-tight ${
                          checked
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {c.name}
                      </span>

                      {/* ✅ Responsive Selection Indicator */}
                      {checked && (
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
                        </div>
                      )}
                    </>
                  )}
                </Radio>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Title Input */}
        <div
          className={
            state === "processing" ? "opacity-50 pointer-events-none" : ""
          }
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title (optional)
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="Enter repertoire title"
            className="p-2 pl-4 w-full text-sm text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 rounded-md border border-gray-400/50 outline-none shadow-inner"
            disabled={state === "processing"}
          />
        </div>

        {/* PGN Input */}
        <div
          className={
            state === "processing" ? "opacity-50 pointer-events-none" : ""
          }
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PGN (optional)
          </label>
          <textarea
            {...register("pgn")}
            rows={4}
            disabled={state === "processing"}
            className={(() => {
              const base =
                "p-2 pl-4 w-full text-sm text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 rounded-md border border-gray-400/50 outline-none shadow-inner"
              let add = ""
              if (errors.pgn) {
                add =
                  "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
              } else if (watch("pgn") && watch("pgn") !== "") {
                add =
                  "focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-300 border-emerald-300 dark:focus:border-emerald-600"
              }

              // ✅ Add disabled styles
              if (state === "processing") {
                add += " opacity-50 cursor-not-allowed"
              }

              return base + " " + add
            })()}
            placeholder="Enter a valid PGN or leave empty"
          />
          {errors.pgn && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.pgn.message}
            </p>
          )}
        </div>
      </div>

      {/* ✅ Fixed: Remove unsupported props and handle disabled state differently */}
      <ModalFooterButtonBar
        onSubmit={handleFormSubmit}
        cancelFunc={handleCancel}
        okLabel={state === "processing" ? "Creating..." : "Create"}
        cancelLabel="Cancel"
      />
    </>
  )
}

export default RepertoireCreation
