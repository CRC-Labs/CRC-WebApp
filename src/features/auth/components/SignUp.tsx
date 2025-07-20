import { useEffect, useState } from "react"

import { gql, useMutation } from "@apollo/client"
import { ApolloError } from "@apollo/client/errors"
import { yupResolver } from "@hookform/resolvers/yup"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

import Layout from "@/features/common/components/Layout"
import { useAppContext } from "@/features/context/providers/AppContextProvider"

import SwitchThemeBar from "../../theme/components/SwitchThemeBar"
import { Icon } from "@/features/common/utils/icons"

// Define the GraphQL mutation for registering a user
const RegisterMutation = gql`
  mutation RegisterMutation($credentials: Credentials!) {
    register(credentials: $credentials)
  }
`

// Define the SignUp component
const SignUp = () => {
  const { loadingState, setLoadingState } = useAppContext()

  useEffect(() => {
    if (loadingState.isLoading) {
      setLoadingState({ isLoading: false, message: "Loaded SignUp" })
    }
  }, [loadingState])
  // Get the setModule function from the AppContextProvider
  const { setModule } = useAppContext()

  // Set the initial state of the component to "idle"
  const [state, setState] = useState("idle")

  // Use the useMutation hook to execute the RegisterMutation
  const [signUp, { loading, reset }] = useMutation(RegisterMutation)

  // Set the initial value of userEmail to either an empty string or the value of localStorage.userEmail
  const [userEmail] = useState(
    localStorage.remember ? localStorage.userEmail : "",
  )

  // Set the initial values of invalidCredentials and errorCreds to false and null, respectively
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [errorCreds, setErrorCreds] = useState(null)

  // Define the validation schema for the form using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  })

  // Set the options for the useForm hook
  const formOptions = {
    resolver: yupResolver(validationSchema),
    revalidateMode: "onBlur",
  }

  // Get the form functions and errors from the useForm hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm(formOptions)

  // Check if there are any errors in the form
  const hasErrors = Object.entries(errors).length !== 0

  // Check if the credentials are invalid
  if (invalidCredentials) {
    if (errorCreds.email !== watch("email")) {
      setInvalidCredentials(false)
    }
  } else if (errorCreds) {
    if (
      errorCreds.email === watch("email") &&
      errorCreds.password === watch("password") &&
      errorCreds.confirmPassword === watch("confirmPassword")
    ) {
      setInvalidCredentials(true)
    }
  }

  // Define the onSubmit function for the form
  function onSubmit(data) {
    // Check if there are any errors in the form
    if (!hasErrors) {
      // Execute the signUp mutation with the user's credentials
      signUp({
        variables: {
          credentials: {
            email: data.email,
            password: data.password,
          },
        },
      })
        .then((result) => {
          // If the mutation is successful, set the state to "success"
          setState("success")
        })
        .catch((e: ApolloError) => {
          // If there is an error, check if it is a network error or a GraphQL error
          if (e.networkError) {
            // Handle network errors here
          } else if (e.graphQLErrors) {
            // If the error is a GraphQL error, check the error message to determine the type of error
            if (
              e.message.startsWith("Error 401") ||
              e.message.startsWith("Error 404") ||
              e.message.startsWith("Error 409")
            ) {
              // If the error is an invalid credentials error, reset the form and set the errorCreds state
              reset()
              setErrorCreds({
                email: data.email,
                password: data.password,
              })
              setInvalidCredentials(true)
            }
          }
        })
    }

    // Prevent the form from submitting
    return false
  }

  // Define the form section of the component
  const formSection = () => (
    <section className="bg-stone-300 px-6 dark:bg-stone-900 sm:max-w-[85vw] sm:px-20">
      <div className="px-6 pb-4 text-justify text-base text-gray-500 dark:text-gray-400">
        <section className="flex w-full max-w-[400px] flex-col items-center px-4 sm:w-[75vw]">
          <header className="flex w-full items-center justify-between self-start border-b border-indigo-400/50">
            <div className="flex items-center px-2 text-lg font-bold text-indigo-400">
              <Icon strokeOpacity="0.5" viewBox="0 0 24 24" name="Register" />
              <p className="px-2 font-bold md:text-lg">Registration</p>
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
                        "block px-2 mt-1 w-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 shadow-inner border outline-none rounded-md  border-gray-400/50"
                      let add
                      if (invalidCredentials || errors.email) {
                        add =
                          "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                      } else {
                        add =
                          "focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:border-gray-300 dark:focus:border-gray-600"
                      }
                      return base + " " + add
                    })()}
                    autoComplete="email"
                    autoFocus
                  />
                </label>
                {errors.email ? (
                  <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                    {errors.email?.message as string}
                  </div>
                ) : (
                  <>
                    {invalidCredentials ? (
                      <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                        Email already used
                      </div>
                    ) : (
                      <div className="h-7" />
                    )}
                  </>
                )}
                <label className="mt-3 block w-full">
                  <div className="flex justify-between gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Choose a Password
                    </span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={(() => {
                      const base =
                        "block px-2 mt-1 w-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 border outline-none rounded-md shadow-inner border-gray-400/50"
                      let add
                      if (errors.password || errors.confirmPassword) {
                        add =
                          "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                      } else {
                        add =
                          "focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:border-gray-300 dark:focus:border-gray-600"
                      }
                      return base + " " + add
                    })()}
                    name="password"
                  />
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={(() => {
                      const base =
                        "block px-2 mt-1 w-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 border outline-none rounded-md shadow-inner border-gray-400/50"
                      let add
                      if (errors.password || errors.confirmPassword) {
                        add =
                          "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                      } else {
                        add =
                          "focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300 focus:border-gray-300 dark:focus:border-gray-600"
                      }
                      return base + " " + add
                    })()}
                    name="confirmPassword"
                  />
                </label>
                <div className="mt-2">
                  {errors.password ? (
                    <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                      {errors.password?.message as string}
                    </div>
                  ) : (
                    <>
                      {errors.confirmPassword ? (
                        <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
                          {errors.confirmPassword?.message as string}
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
                      <div className="select-none px-2">Register</div>
                    </div>
                  ) : (
                    <>
                      {loading ? (
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md border border-indigo-500/90 bg-indigo-500/90 px-4 py-2 text-center font-semibold text-gray-200 focus:outline-none dark:text-gray-300"
                        >
                          <Icon
                            className="-ml-1 mr-3 h-6 w-6 animate-spin text-white"
                            strokeOpacity="0.5"
                            viewBox="0 0 24 24"
                            name="Spinner"
                          />
                          <div className="select-none px-2">Register</div>
                        </button>
                      ) : (
                        <button className="flex w-full justify-center rounded-md border border-indigo-500/90 bg-indigo-500/90 px-4 py-2 text-center font-semibold text-gray-200 focus:outline-none dark:text-gray-300">
                          <Icon
                            strokeOpacity="0.5"
                            viewBox="0 0 24 24"
                            name="Register"
                          />
                          <div className="select-none px-2">Register</div>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          </section>
          <SwitchThemeBar />
        </section>
      </div>
    </section>
  )

  // Define the success section of the component
  const successSection = () => (
    <section className="flex w-full flex-col items-center justify-center gap-8 bg-emerald-300/10 p-8 py-10 text-gray-500/80 shadow-inner dark:border-zinc-800 dark:bg-emerald-900/10 dark:text-gray-400">
      <div className="flex w-full max-w-[450px] items-center justify-center gap-4 px-4 text-2xl font-semibold text-emerald-800/50 dark:text-emerald-600/60 sm:w-[75vw]">
        <Icon name="CheckCircle" className="h-32 w-32" strokeOpacity="0.8" />
        <p>
          Thank you for subscribing, your email address has been successfully
          registered.
        </p>
      </div>
      <div className="flex w-full items-center justify-center">
        You can proceed to login or go back to the main menu by clicking on the
        top logo
      </div>
      <div className="flex flex-col">
        <Link
          href="/app?module=4"
          className="flex animate-pulse flex-col items-center rounded-lg border border-gray-400/60 px-8 py-2 font-bold text-indigo-400 shadow-md outline-none transition-all duration-200 file:text-xs hover:bg-indigo-400/20 hover:text-indigo-500 hover:shadow-inner focus:bg-indigo-300/20 focus:text-indigo-700 focus:shadow-inner"
        >
          <Icon className="h-16 w-16" name="Login" />
          <p className="text-xl">Login</p>
        </Link>
      </div>
    </section>
  )

  // Render the component
  return (
    <Layout
      logo={true}
      onClick={() => {
        setModule(0)
      }}
      demoHeader={false}
    >
      {state === "success" && successSection()}

      {state === "idle" && formSection()}
    </Layout>
  )
}

// Export the SignUp component
export default SignUp
