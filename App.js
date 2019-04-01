import React from 'react'
import { View } from 'react-native'
import Feed from './src/components/Feed'

// Apollo
import { Rehydrated } from 'aws-appsync-react'
import { ApolloProvider } from 'react-apollo'

// AppSync
import AWSAppSyncClient from "aws-appsync"

// Amplify
import Auth from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'
import { withAuthenticator } from 'aws-amplify-react-native'
import awsconfig from './src/aws-exports'

Amplify.configure(awsconfig)

// Create a client
const GRAPHQL_API_REGION = awsconfig.aws_appsync_region
const GRAPHQL_API_ENDPOINT_URL = awsconfig.aws_appsync_graphqlEndpoint
const S3_BUCKET_REGION = awsconfig.aws_user_files_s3_bucket_region
const S3_BUCKET_NAME = awsconfig.aws_user_files_s3_bucket
const AUTH_TYPE = awsconfig.aws_appsync_authenticationType

const client = new AWSAppSyncClient({
  url: GRAPHQL_API_ENDPOINT_URL,
  region: GRAPHQL_API_REGION,
  auth: {
    type: AUTH_TYPE,
    jwtToken: async () => (
      await Auth.currentSession()).getAccessToken().getJwtToken(),
  },
  complexObjectsCredentials: () => Auth.currentCredentials(),
  disableOffline: true
})

class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Feed
          options={{
            bucket: S3_BUCKET_NAME,
            region: S3_BUCKET_REGION
          }}
        />
      </View>
    )
  }
}

// Wrap the App with Amplify HOC
const AppWithAuth = withAuthenticator(App, true)

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <AppWithAuth />
    </Rehydrated>
  </ApolloProvider>
)
