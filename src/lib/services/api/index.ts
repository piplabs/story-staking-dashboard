import axios, { AxiosError } from 'axios'

export const stakingDataAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STAKING_API_URL}/api`,
})

class ApiError extends Error {
  constructor(data: { message: string }) {
    super(data.message)
    this.name = 'ApiError'
  }
}

// stakingDataAxios.interceptors.response.use(
//   function (response) {
//     // Convert all response data to camelCase
//     if (response.data && typeof response.data === 'object') {
//       return convertKeysToCamelCase(response.data)
//     }
//     console.log(response)
//     return response
//   },
//   function (error) {
//     console.log({ error })
//     let errorMessage = 'An unexpected error occurred'

//     if (error instanceof AxiosError) {
//       const parsedError = convertKeysToCamelCase(error.response?.data || {})
//       return Promise.reject(new ApiError(parsedError))
//     }

//     return Promise.reject(new ApiError({ message: errorMessage }))
//   }
// )
