// Interface to define the JWT
export interface JwtIF {
  roles: Array<string>
}

export interface AuthIF {
  data: {
    roles: Array<string>
  }
}
