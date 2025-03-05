import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

//Apollo Client Configuration
const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

//Interface for Props
interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

//ApolloProvider Wrapper Component
const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
