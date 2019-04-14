# Plush

![Plush](https://user-images.githubusercontent.com/26605247/56092404-a2808780-5eb3-11e9-82de-60f9a651ceee.png)

Plush is a full-stack mobile application for pictures sharing. It uses Expo and React Native for the front end, AWS Amplify as the back-end service, and the API service is made using graphQL.

## Overview

After sign up/sign in, users can perform the following:
* Give access to their mobile device library by pressing the camera icon in the header.
* Upload pictures to the feed.
* Like and unlike pictures (from other users and their own).
* Refresh the feed by pull-to-refresh or by pressing the reload button in the header.
* Flag inappropriate content by pressing the options icon in the image card footer.
* Remove their own pictures from the feed. Also available in the options icon.


## App flow

* Users are authenticated using out of the box AWS Amplify authentication flow.

* Users a redirected to the only screen of the app: the feed.

* When a user uploads a picture:
  * A put request with RNS3 will store the file in an AWS-S3 bucket.
  * An Apollo graphql mutation will store a record in a DynamoDB Picture table.
  
* When a user flags inappropriate content:
  * An AppSync Client graphql mutation will store a record in a DynamoDB Flag table.
  * The front-end will hide that picture from the user's feed.
  
* When a user likes/unlikes a picture:
  * An AppSync Client graphql mutation will create a like instance in a DynamoDB Like table.
  * An AppSync Client graphql mutation will destroy that like instance from the DynamoDB Like table.
  
* When a user deletes a picture:
  * A remove request with the Amplify Storage API will delete the associated file from the AWS-S3 bucket.
  * An Apollo graphql mutation will destroy the record from the DynamoDB Picture table.
  * The feed is refreshed to display the current pictures.
  
* When a user refreshes the feed:
  * An AppSync Client graphql query will request all the current pictures stored in the DynamoDB Picture table.
  
## How to run this on your local machine?

You need the following tools:

* [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)
  * `npm install -g expo-cli`
  
* [AWS account](https://aws.amazon.com/amplify/)

* [Node JS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

* [AWS Amplify CLI](https://aws-amplify.github.io/)
  * `npm install -g @aws-amplify/cli`
  * `amplify configure` ([link](https://www.youtube.com/watch?v=fWbM5DLh25U) for a step by step video).

## Configuring the project

1. Clone this repo to your local machine.

```
git clone https://github.com/jtaylor1989/plush

cd plush
```

2. Add AWS Amplify dependencies to your project.

```
yarn add aws-amplify aws-amplify-react-native

# or

npm install aws-amplify aws-amplify-react-native
```

3. Initialise the AWS Amplify project.

```
amplify init
```

Follow the same instructions as below.

<img width="561" alt="init" src="https://user-images.githubusercontent.com/26605247/54110565-98152e80-43d9-11e9-9eed-e728cbf2ecd6.png">

4. Configure an Amazon Cognito User Pool to store users credentials.
```
amplify add auth

# When prompt, choose: Yes, use the default configuration.
```

5. Add an Amazon S3 bucket to store pictures.

```
amplify add storage

# Choose: Content (Images, audio, video, etc.)
# Give access to only authenticated users.
# Give users read/write acces.
```

6. Add the AWS AppSync API to use GraphQL and store data in DynammoDB.

```
amplify add api

# Choose GraphQL as the API service. 
# Choose an authorization type for the API: Amazon Cognito User Pool
# Do you have an annotated GraphQL schema? Yes
# Provide your schema file path: src/graphQL/schema.graphql
```

7. Time to deploy your project to the cloud :stuck_out_tongue:.

```
amplify push
```

<img width="473" alt="cloudformation" src="https://user-images.githubusercontent.com/26605247/54111473-d7447f00-43db-11e9-9fe8-57edd0a36fe8.png">

```
Do you want to generate code for your newly created GraphQL API: No.
```

The AWS Amplify CLI will create an Amazon Cognito User Pool and Identity Pool, an Amazon S3 bucket to store each users pictures and an AWS AppSync GraphQL API that uses Amazon DynamoDB to store metadata about the pictures (i.e. bucket name, likes, flags, owner, date of creation ... etc).

# Running the application

1. Install client dependencies.

```
yarn

# or

npm install
```

2. You will need your AWS IAM credentials before running the application. 
 * Copy your access and secret keys in the `src/myKeys.js` file of your project.

```javascript
const keys = {
 accessKey: 'blablabla',
 secretKey: 'blablabla',
}
export default keys;
```
 * Save changes.

3. Time to test the app :rocket:.

```
expo start --ios

# or

expo start --android
```

3. Create a new user.

* The app uses the Higher Order Component **withAuthenticator** (HOC) from AWS Amplify to perform the authentication flow: sign up, confirm sign up and sign in users.

4. Add and display pictures.

* If the application runs successfully you should be able to press the camera icon, allow access to the device library, and select a picture from your device. This will upload the picture to S3 then make a GraphQL call to enter the record into DynamoDB. 

* You can then press the refresh button to display the picture on the screen.

* You can like/unlike and flag other users pictures, and delete your own pictures. 

# Want to contribute ?
* If you like this project, help me grow and improve it by sending pull requests :muscle:.


