import axios from 'axios'

/**
 * fetch config from environment and API
 */
export const fetchConfig = () => {
  const origin: string = window.location.origin
  const vueAppPath: string = process.env.VUE_APP_PATH
  const vueAppAuthPath:string = process.env.VUE_APP_AUTH_PATH

  if (!vueAppPath || !vueAppAuthPath) {
    throw new Error('failed to get env variables')
  }

  const baseUrl: string = `${origin}/${vueAppPath}/`
  sessionStorage.setItem('BASE_URL', baseUrl)
  console.log('Set Base URL to: ' + baseUrl)

  const authUrl: string = `${origin}/${vueAppAuthPath}/`
  sessionStorage.setItem('AUTH_URL', authUrl)
  console.log('Set Auth URL to: ' + authUrl)

  const url = `/config/configuration.json`
  const headers = {
    'Accept': 'application/json',
    'ResponseType': 'application/json',
    'Cache-Control': 'no-cache'
  }

  return axios
    .get(url, { headers })
    .then((response: any) => {
      const apiUrl: string = response.data['API_URL']
      axios.defaults.baseURL = apiUrl
      console.log('Set Legal API URL to: ' + apiUrl)

      const authApiUrl: string = response.data['AUTH_API_URL']
      sessionStorage.setItem('AUTH_API_URL', authApiUrl)
      console.log('Set Auth API URL to: ' + authApiUrl)

      const payApiUrl: string = response.data['PAY_API_URL']
      sessionStorage.setItem('PAY_API_URL', payApiUrl)
      console.log('Set Pay API URL to: ' + payApiUrl)

      // Extend the window with type
      let myWindow = window as any

      myWindow.addressCompleteKey = response.data['ADDRESS_COMPLETE_KEY']
      console.log('Set Address Complete Key.')

      myWindow['ldClientId'] = response.data['LD_CLIENT_ID']
      console.log('Set LD Client Id.')
    })
}
