import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feed from './src/components/Feed'

// Apollo
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

// AppSync
import AWSAppSyncClient from "aws-appsync";

// Amplify
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);

// Create a client
const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
const AUTH_TYPE = awsconfig.aws_appsync_authenticationType

const client = new AWSAppSyncClient({
  url: GRAPHQL_API_ENDPOINT_URL,
  region: GRAPHQL_API_REGION,
  auth: {
    type: AUTH_TYPE,
    jwtToken: async () => (
      await Auth.currentSession()).getAccessToken().getJwtToken(),
  },
  disableOffline: true
});

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Feed />
      </View>
    )
  }
}

// Wrap the App with Amplify HOC
const AppWithAuth = withAuthenticator(App, true);

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
