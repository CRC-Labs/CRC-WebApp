import { useEffect } from "react"

import Link from "next/link"

import { useApi } from "@/features/api/providers/ApiProvider"
import {
  Modules,
  useAppContext,
} from "@/features/context/providers/AppContextProvider"
import { getWidthAndHeight } from "@/features/common/utils/helpers"
import { Icon } from "@/features/common/utils/icons"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"

const hexClass = "relative h-full pointer-events-none user-select-none"

const iconProps = {
  strokeWidth: 1,
  stroke: "#818cf8",
  x: "28.5%",
  y: "15%",
  viewBox: "0 0 56 56",
}

const textStyle: React.CSSProperties = {
  userSelect: "none",
}

const textProps = {
  textAnchor: "middle",
  x: "50%",
  y: "75%",
  className: "text-5xl font-semibold fill-indigo-400",
  style: textStyle,
}

const hexagonStyle = {
  cursor: "pointer",
  strokeWidth: 0.5, // Réduction de l'épaisseur du trait
  fill: "currentColor",
  stroke: "#818cf8",
}

const hexagonProps = {
  className: hexClass,
  style: hexagonStyle,
  hexProps: {
    className: "text-zinc-200 dark:text-zinc-900 shadow-inner",
    pointerEvents: "fill",
  },
}

const donateHexagonProps = {
  className:
    "relative h-full pointer-events-none user-select-none animate-pulse",
  style: {
    cursor: "pointer",
    strokeWidth: 0.5,
    fill: "#e1ccac",
    stroke: "#818cf8",
  },
  hexProps: {
    className: "text-zinc-200 dark:text-zinc-900 shadow-inner",
    pointerEvents: "fill",
  },
}

function HexagonMenu({ closeMenu }) {
  const [width, height] = getWidthAndHeight()
  const { setModule, setIsSettingsModalOpen } = useAppContext()
  const { authenticationState } = useAuthenticationState()
  const { auth } = useApi()
  useEffect(() => {}, [authenticationState.isAuthenticated])

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("touchstart", handleClick)
    // document.addEventListener("contextmenu", handleContextMenu)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("touchstart", handleClick)
      // document.removeEventListener("contextmenu", handleContextMenu)
    }
  })

  function handleClick(e) {
    let menu = document.querySelector("#hexagonMenu")
    const isClickedOutside = !menu.contains(e.target)
    if (isClickedOutside) {
      closeMenu()
    }
  }
  const Hexagon = ({
    children,
    onClick,
    style,
    svgStyle = { width: width / 2.8 },
    className,
    hexProps,
  }) => {
    const points = "50 1, 95 25, 95 75, 50 99, 5 75, 5 25"

    return (
      <div className={className} style={style}>
        <svg viewBox="0 0 100 100" onClick={onClick} style={svgStyle}>
          <polygon points={points} {...hexProps} />
          {children}
        </svg>
      </div>
    )
  }

  const textProps = {
    textAnchor: "middle",
    x: "50%",
    y: "75%",
    className: "fill-indigo-400 font-thin font-sans text-sm", // Mise à jour du style du texte
    style: textStyle,
  }

  const RepertoiresHexagon = (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        setModule(Modules.Repertoires)
      }}
    >
      <Icon {...iconProps} name="Repertoires" />
      <text {...textProps}>Repertoires</text>
    </Hexagon>
  )
  const TrainingsHexagon = (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        setModule(Modules.Trainings)
      }}
    >
      <Icon {...iconProps} name="Trainings" />
      <text {...textProps}>Trainings</text>
    </Hexagon>
  )
  const DocumentationHexagon = (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        window.open("https://wiki.chess-repertoire-companion.com", "_blank")
      }}
    >
      <a href="https://wiki.chess-repertoire-companion.com" rel="noopener">
        <Icon {...iconProps} name="Documentation" />
        <text {...textProps}>Doc</text>
      </a>
    </Hexagon>
  )
  const DonateHexagon = (
    <Hexagon
      {...donateHexagonProps}
      onClick={() => {
        window.open("/donate", "_blank")
      }}
    >
      <Link href="/donate" target="_blank" rel="noopener noreferrer">
        <Icon {...iconProps} name="Donate" />
        <text {...textProps}>Donate</text>
      </Link>
    </Hexagon>
  )
  const LogoutHexagon = authenticationState.isAuthenticated ? (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        auth.signOut()
      }}
    >
      <Icon {...iconProps} name="Logout" />
      <text {...textProps}>Logout</text>
    </Hexagon>
  ) : (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        setModule(Modules.SignIn)
      }}
    >
      <Icon {...iconProps} name="Login" />
      <text {...textProps}>Login</text>
    </Hexagon>
  )

  const AccountHexagon = (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        auth.signOut()
      }}
    >
      <Icon {...iconProps} name="User" />
      <text {...textProps}>Account</text>
    </Hexagon>
  )
  const SettingsHexagon = (
    <Hexagon
      {...hexagonProps}
      onClick={() => {
        setIsSettingsModalOpen(true)
      }}
    >
      <Icon {...iconProps} name="Settings" />
      <text {...textProps}>Settings</text>
    </Hexagon>
  )

  return (
    <div
      id="hexagonMenu"
      className="relative flex h-full w-full flex-col items-center"
    >
      <div
        onClick={closeMenu}
        style={{ width: width / 7, height: height / 9 }}
        className="pointer-events-auto absolute right-0 top-0 flex cursor-pointer items-center justify-center rounded-bl-xl border-l border-gray-300/50 bg-gray-300/50 shadow-md hover:bg-zinc-300/40 dark:border-gray-400"
      >
        <Icon
          className="text-gray-500 dark:text-gray-400"
          name="Menu"
          style={{ width: width / 11, height: height / 12 }}
        />
      </div>
      <div className="relative flex bottom-[-6%]">
        <div className="relative left-[2.5%]">{RepertoiresHexagon}</div>
        <div className="relative right-[2.5%]">{DonateHexagon}</div>
      </div>
      <div className="relative flex bottom-[3.4%]">
        <div className="relative left-[3.4%]">
          <Hexagon children={undefined} onClick={undefined} {...hexagonProps} />
        </div>
        {DocumentationHexagon}
        <div className="relative right-[3.4%]">
          <Hexagon
            children={undefined}
            onClick={undefined}
            {...hexagonProps}
          ></Hexagon>
        </div>
      </div>
      <div className="relative flex bottom-[12.7%]">
        <div className="relative left-[2.5%]">{SettingsHexagon}</div>
        <div className="relative right-[2.5%]">{LogoutHexagon}</div>
      </div>
    </div>
  )
}

export default HexagonMenu
