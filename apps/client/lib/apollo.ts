import { ApolloClient, InMemoryCache } from '@apollo/client'

console.log({
  API: process.env.EXPO_PUBLIC_GRAPHQL_API,
})

export const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_API,
  cache: new InMemoryCache(),
})
