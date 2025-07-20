import { useEffect } from "react"

import Link from "next/link"

import Footer from "@/features/common/components/Footer"
import { useApi } from "@/features/api/providers/ApiProvider"
import {
  Modules,
  useAppContext,
} from "@/features/context/providers/AppContextProvider"
import Layout from "@/features/common/components/Layout"
import { getWindowWidthAndHeight } from "@/features/common/utils/helpers"
import { Icon } from "@/features/common/utils/icons"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"

// Define the hexagon class and style
const hexClass = "relative h-full pointer-events-none user-select-none"
const hexagonStyle = {
  cursor: "pointer",
  strokeWidth: 0.5,
  fill: "currentColor",
  stroke: "#818cf8",
}

// Define the icon properties
const iconProps = {
  strokeWidth: 1,
  stroke: "#818cf8",
  x: "28.5%",
  y: "15%",
  viewBox: "0 0 56 56",
}

// Define the text style and properties
const textStyle: React.CSSProperties = {
  userSelect: "none",
}
const textProps = {
  textAnchor: "middle",
  x: "50%",
  y: "75%",
  className: "fill-indigo-400 font-thin font-sans text-sm",
  style: textStyle,
}

// Define the hexagon properties
const hexagonProps = {
  className: hexClass,
  style: hexagonStyle,
  hexProps: {
    className: "text-zinc-200 dark:text-zinc-900 shadow-inner",
    pointerEvents: "fill",
  },
}

// Define the donate hexagon properties
const donateHexagonProps = {
  className:
    "relative h-full pointer-events-none user-select-none animate-pulse",
  style: {
    cursor: "pointer",
    strokeWidth: 1,
    fill: "#e1ccac",
    stroke: "#818cf8",
  },
  hexProps: {
    className: "text-zinc-200 dark:text-zinc-900 shadow-inner",
    pointerEvents: "fill",
  },
}

/**
 * The main React component for the main menu.
 *
 * @returns The main React component for the main menu.
 */
function MainMenu() {
  // Get the router, app context, and API from the providers
  const { setModule, setIsSettingsModalOpen, loadingState, setLoadingState } =
    useAppContext()
  const { authenticationState } = useAuthenticationState()

  // Get the window width, height, and orientation using the `getWindowWidthAndHeight` helper function
  const [width, height, orientation] = getWindowWidthAndHeight()

  // Get the auth object from the API provider
  const { auth: authApi } = useApi()

  // Use the `useEffect` hook to update the component when the authentication status changes
  useEffect(() => {}, [authenticationState.isAuthenticated])
  useEffect(() => {
    if (loadingState.isLoading) {
      setLoadingState({ isLoading: false, message: "Loaded Main Menu" })
    }
  }, [loadingState])
  let s = { width: 230 }

  if (orientation == "lg-landscape") {
    s = { width: width / 8 }
  } else if (orientation === "lg-portrait") {
    s = { width: 150 }
  } else if (orientation === "sm-portrait") {
    s = { width: 150 }
  }

  const Hexagon = ({
    children,
    onClick,
    style,
    svgStyle = s,
    className,
    hexProps,
  }) => {
    // Calcul des points de l'hexagone
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

  // Define the hexagons for each menu item
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
      onClick={(e) => {
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
        authApi.signOut()
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
        authApi.signOut()
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

  // Determine the layout of the hexagons based on the window orientation
  let hexLayout
  if (orientation === "square" || orientation === "sm-landscape") {
    hexLayout = (
      <div
        id="hexagonMenu"
        className="flex w-full flex-col items-center h-[600px]"
      >
        <div className="relative flex ">
          <div className="relative left-[11px]">{RepertoiresHexagon}</div>
          <div className="relative right-[12px]">{DonateHexagon}</div>
        </div>
        <div className="relative bottom-[60px] flex">
          <div className="relative left-[23px]">
            <Hexagon
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            />
          </div>
          <div>{DocumentationHexagon}</div>
          <div className="relative right-[23px]">
            <Hexagon
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            ></Hexagon>
          </div>
        </div>
        <div className="relative bottom-[120px] flex ">
          <div className="relative left-[11px]">{SettingsHexagon}</div>
          <div className="relative right-[12px]">{LogoutHexagon}</div>
        </div>
      </div>
    )
  } else if (orientation === "lg-landscape") {
    hexLayout = (
      <div
        id="hexagonMenu"
        className="relative flex max-h-[100vw] w-full max-w-[90vw] flex-col items-center mb-4"
      >
        <div className="relative top-[2.5%] flex h-[14vw]">
          {RepertoiresHexagon}
          {DonateHexagon}
          <Hexagon
            svgStyle={undefined}
            children={undefined}
            onClick={undefined}
            {...hexagonProps}
          />
          {DocumentationHexagon}
          <Hexagon
            svgStyle={undefined}
            children={undefined}
            onClick={undefined}
            {...hexagonProps}
          />
          {SettingsHexagon}
          {LogoutHexagon}
        </div>
      </div>
    )
  } else if (orientation === "lg-portrait") {
    hexLayout = (
      <div
        id="hexagonMenu"
        className="relative flex w-full flex-col items-center max-h-[620px]"
      >
        <div className="relative flex">
          <div className="relative">{RepertoiresHexagon}</div>
        </div>
        <div className="relative bottom-[38px] flex">
          <div className="relative left-[8px]">{DonateHexagon}</div>
          <div className="relative right-[8px]">
            <Hexagon
              svgStyle={undefined}
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            />
          </div>
        </div>
        <div className="relative bottom-[77px] flex">
          <div className="relative">{DocumentationHexagon}</div>
        </div>
        <div className="relative bottom-[116px] flex">
          <div className="relative left-[8px]">
            <Hexagon
              svgStyle={undefined}
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            />
          </div>
          <div className="relative right-[8px]">{SettingsHexagon}</div>
        </div>
        <div className="relative bottom-[155px] flex">
          <div className="relative">{LogoutHexagon}</div>
        </div>
      </div>
    )
  } else if (orientation === "sm-portrait") {
    hexLayout = (
      <div
        id="hexagonMenu"
        className="relative flex w-full flex-col items-center max-h-[620px]"
      >
        <div className="relative flex">
          <div className="relative">{RepertoiresHexagon}</div>
        </div>
        <div className="relative bottom-[38px] flex">
          <div className="relative left-[8px]">{DonateHexagon}</div>
          <div className="relative right-[8px]">
            <Hexagon
              svgStyle={undefined}
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            />
          </div>
        </div>
        <div className="relative bottom-[77px] flex">
          <div className="relative">{DocumentationHexagon}</div>
        </div>
        <div className="relative bottom-[116px] flex">
          <div className="relative left-[8px]">
            <Hexagon
              svgStyle={undefined}
              children={undefined}
              onClick={undefined}
              {...hexagonProps}
            />
          </div>
          <div className="relative right-[8px]">{SettingsHexagon}</div>
        </div>
        <div className="relative bottom-[155px] flex">
          <div className="relative">{LogoutHexagon}</div>
        </div>
      </div>
    )
  }
  // Render the main menu layout with the hexagons and footer
  return (
    <Layout logo={true} onClick={null}>
      {hexLayout}
      <Footer />
    </Layout>
  )
}

export default MainMenu
