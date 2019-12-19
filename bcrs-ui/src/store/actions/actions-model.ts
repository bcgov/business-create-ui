
export const setName = ({ commit }: any, name: string): void => {
  commit('mutateName', name)
}

export const setResource = ({ commit }: any, resource: object): void => {
  commit('mutateResource', resource)
}
