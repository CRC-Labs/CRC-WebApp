import { memo, useEffect, useState } from "react"

import { gql, useMutation } from "@apollo/client"
import { ApolloError } from "@apollo/client/errors"
import { yupResolver } from "@hookform/resolvers/yup"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Store } from "react-notifications-component"
import * as Yup from "yup"

import {
  Modules,
  useAppContext,
} from "@/features/context/providers/AppContextProvider"

import Layout from "@/features/common/components/Layout"
import SwitchThemeBar from "../../theme/components/SwitchThemeBar"
import { Icon } from "@/features/common/utils/icons"
import { useAuthenticationState } from "../providers/AuthenticationStateProvider"

const LoginMutation = gql`
  mutation LoginMutation($credentials: Credentials!) {
    login(credentials: $credentials) {
      token
    }
  }
`
const SignIn = () => {
  // Get the `signIn` mutation, `setIsAuthenticated` function, and `setModule` function from the `useApi` and `useAppContext` hooks
  const [signIn, { loading, reset }] = useMutation(LoginMutation)
  const { setAuthenticationState } = useAuthenticationState()
  const { setModule } = useAppContext()
  const { loadingState, setLoadingState } = useAppContext()

  useEffect(() => {
    if (loadingState.isLoading) {
      setLoadingState({ isLoading: false, message: "Loaded SignIn" })
    }
  }, [loadingState])

  // Define state variables for the user's email, remember preference, invalid credentials, and error credentials
  const [userEmail] = useState(
    localStorage.remember ? localStorage.userEmail : "",
  )
  const [remember] = useState(localStorage.remember ? true : false)
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [errorCreds, setErrorCreds] = useState(null)

  // Define the validation schema for the sign-in form using the `Yup` library
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
    remember: Yup.boolean(),
  })

  // Define the form options using the `yupResolver` function from the `@hookform/resolvers/yup` library
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm(formOptions)
  const hasErrors = Object.entries(errors).length !== 0

  if (invalidCredentials) {
    // If the `invalidCredentials` state variable is `true`, check if the user has corrected their email or password
    if (
      errorCreds.email !== watch("email") ||
      errorCreds.password !== watch("password")
    ) {
      // If the user has corrected their email or password, set the `invalidCredentials` state variable to `false`
      setInvalidCredentials(false)
    }
  } else if (errorCreds) {
    // If the `invalidCredentials` state variable is `false` and the `errorCreds` state variable is defined, check if the user has entered the same email and password as the previous error
    if (
      errorCreds.email === watch("email") &&
      errorCreds.password === watch("password")
    ) {
      // If the user has entered the same email and password as the previous error, set the `invalidCredentials` state variable to `true`
      setInvalidCredentials(true)
    }
  }

  function onSubmit(data) {
    // Check if there are any form errors
    if (!hasErrors) {
      // If the "remember me" checkbox is checked, save the user's email and remember preference to local storage
      if (data.remember) {
        localStorage.userEmail = data.email
        localStorage.remember = true
      } else {
        // If the "remember me" checkbox is unchecked, remove the user's email and remember preference from local storage
        localStorage.removeItem("userEmail")
        localStorage.removeItem("remember")
      }
      // Call the `signIn` mutation with the user's email and password
      signIn({
        variables: {
          credentials: {
            email: data.email,
            password: data.password,
          },
        },
      })
        .then((result) => {
          setModule(Modules.MainMenu)
          // Display a success notification using the `react-notifications-component` library
          Store.addNotification({
            title: "Login Successful",
            message: "You are now authenticated",
            type: "success",
            insert: "bottom",
            container: "bottom-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          })
          setTimeout(() => {
            setAuthenticationState({
              isAuthenticated: true,
              authToken: result.data.login.token,
              isInitializing: false,
            })
          }, 100)
        })
        .catch((e: ApolloError) => {
          // If the mutation throws an error, handle it based on the error type and display an error notification if necessary
          if (e.networkError) {
            // Handle network errors
          } else if (e.graphQLErrors) {
            if (
              e.message.startsWith("Error 401") ||
              e.message.startsWith("Error 404")
            ) {
              // If the error is a 401 or 404, display an error notification and reset the form
              reset()
              // Set the `errorCreds` state variable to the user's email and password, and set the `invalidCredentials` state variable to `true`
              setErrorCreds({
                email: data.email,
                password: data.password,
              })
              setInvalidCredentials(true)
            }
          }
        })
    }

    // Prevent the form from submitting and displaying form data on success
    return false
  }

  return (
    <Layout
      logo={true}
      onClick={() => {
        setModule(0)
      }}
      demoHeader={false}
    >
      <section className="flex w-full max-w-[400px] flex-col items-center px-4 sm:w-[75vw]">
        <header className="flex w-full items-center justify-between self-start border-b border-indigo-400/50">
          <div className="flex items-center px-2 text-lg font-bold text-indigo-400">
            <Icon strokeOpacity="0.5" viewBox="0 0 24 24" name="LockClosed" />
            <p className="px-2 font-bold md:text-lg">Authentication</p>
          </div>
        </header>
        <section className="mt-2 flex w-full flex-col items-center justify-center rounded-lg border border-gray-400/50 bg-zinc-200 p-4 shadow-inner dark:bg-zinc-900 sm:min-w-[400px]">
          <div className="flex w-full items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block w-full">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  E-Mail Address
                </span>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  spellCheck="false"
                  defaultValue={userEmail}
                  name="email"
                  placeholder="example@email.com"
                  className={(() => {
                    const base =
                      "block px-2 mt-1 w-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 rounded-md shadow-inner border outline-none  border-gray-400/50"
                    let add
                    if (invalidCredentials) {
                      add =
                        "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                    } else {
                      add =
                        "focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:border-gray-300 dark:focus:border-gray-600"
                    }
                    return base + " " + add
                  })()}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </label>
              <label className="mt-3 block w-full">
                <div className="flex justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Password
                  </span>
                  <div>
                    <a
                      className="block text-sm text-indigo-700 hover:underline dark:text-indigo-400"
                      href="http://localhost:8000/password/reset"
                    >
                      Forgot Your Password?
                    </a>
                  </div>
                </div>

                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={(() => {
                    const base =
                      "block px-2 mt-1 w-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 border outline-none rounded-md shadow-inner border-gray-400/50"
                    let add
                    if (invalidCredentials || errors.password) {
                      add =
                        "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                    } else {
                      add =
                        "focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:border-gray-300 dark:focus:border-gray-600"
                    }
                    return base + " " + add
                  })()}
                  name="password"
                  required
                  autoComplete="current-password"
                />
              </label>
              <div className="mt-4 flex w-full items-center justify-between">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register("remember")}
                      defaultChecked={remember}
                      className="border-gray-600"
                      name="remember"
                      id="remember"
                    />
                    <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                      Remember Me
                    </span>
                  </label>
                </div>
              </div>
              <div className="mt-2">
                {errors.password ? (
                  <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                    {errors.password?.message as string}
                  </div>
                ) : (
                  <>
                    {invalidCredentials ? (
                      <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                        Invalid credentials
                      </div>
                    ) : (
                      <div className="h-7" />
                    )}
                  </>
                )}
                {hasErrors || invalidCredentials ? (
                  <div className="flex w-full animate-pulse justify-center rounded-md border border-red-700 bg-transparent px-4 py-2 text-center font-semibold text-red-700 focus:outline-none dark:border-red-400 dark:text-red-400">
                    <Icon
                      strokeOpacity="0.5"
                      viewBox="0 0 24 24"
                      name="Warning"
                    />
                    <div className="select-none px-2">Login</div>
                  </div>
                ) : (
                  <>
                    {loading ? (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-indigo-500/90 bg-indigo-500/90 px-4 py-2 text-center font-semibold text-gray-200 focus:shadow-inner dark:text-gray-300"
                      >
                        <Icon
                          className="-ml-1 mr-3 h-6 w-6 animate-spin text-white"
                          strokeOpacity="0.5"
                          viewBox="0 0 24 24"
                          name="Spinner"
                        />
                        <div className="select-none px-2">Login</div>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-indigo-500/90 bg-indigo-500/90 px-4 py-2 text-center font-semibold text-gray-200 focus:shadow-inner dark:text-gray-300"
                      >
                        <Icon
                          strokeOpacity="0.5"
                          viewBox="0 0 24 24"
                          name="Login"
                        />
                        <div className="select-none px-2">Login</div>
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
          <div className="mt-4 flex flex-col space-y-5">
            <span className="flex items-center justify-center space-x-2">
              <span className="h-px w-14 bg-gray-400" />
              <span className="text-center font-normal text-gray-500 dark:text-gray-400">
                or
                {/* or login with */}
              </span>
              <span className="h-px w-14 bg-gray-400" />
            </span>
            <div className="flex flex-col space-y-4">
              <Link
                href="/app?module=5"
                className="flex flex-col items-center rounded-lg px-4 py-1 text-xs font-bold text-emerald-500/60 outline-none transition-all duration-200 file:text-xs hover:bg-emerald-400/20 hover:text-emerald-600 hover:shadow-inner focus:bg-emerald-300/20 focus:text-emerald-600 focus:shadow-inner dark:hover:text-emerald-300 dark:focus:text-emerald-300"
              >
                <Icon strokeOpacity="0.5" className="h-8 w-8" name="Register" />
                <p className="opacity-50">Register</p>
              </Link>

              {/* <a
                href="#"
                className="group flex items-center justify-center space-x-2 rounded-md border border-gray-800 py-2 px-4 transition-colors duration-300 focus:outline-none dark:border-gray-400"
              >
                <span>
                  <svg
                    className="h-5 w-5 fill-current text-gray-800 group-hover:text-white dark:text-gray-400"
                    viewBox="0 0 16 16"
                    version="1.1"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-gray-800 group-hover:text-white dark:text-gray-400">
                  Github
                </span>
              </a>
              <a
                href="#"
                className="group flex items-center justify-center space-x-2 rounded-md border border-blue-500 py-2 px-4 transition-colors duration-300 focus:outline-none"
              >
                <span>
                  <svg
                    className="text-blue-500 group-hover:text-white"
                    width={20}
                    height={20}
                    fill="currentColor"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-blue-500 group-hover:text-white">
                  Twitter
                </span>
              </a> */}
            </div>
          </div>
        </section>
        <SwitchThemeBar />
      </section>
    </Layout>
  )
}

export default memo(SignIn)
