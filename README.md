# Pictures sharing app with Expo and React Native, AWS Amplify and Apollo GraphQL Client.

## Overview

Users can perform the following:
* Give access to their mobile device library by pressing the camera icon in the header.
* Upload pictures to the feed.
* Like and unlike pictures (from other users and their own).
* Refresh the feed by pull-to-refresh or by pressing the reload button in the header.
* Flag inappropriate content by pressing the options icon in the image card footer.
* Remove their own pictures from the feed. Also available in the options icon.


## App flow

* When the user uploads a picture:
  * A put request with RNS3 will store the file in an AWS-S3 bucket.
  * An Apollo graphql mutation will store a record in a DynamoDB Pictures table.
  
* When a user flags inappropriate content:
  * An AppSync Client graphql mutation will store a record in a DynamoDB Flags table.
  * The front-end will hide that picture from the user's feed.
  
* When the user likes/unlikes a picture:
  * An AppSync Client graphql mutation will create a like instance in a DynamoDB Likes table.
  * An AppSync Client graphql mutation will destroy that like instance from the DynamoDB Likes table.
  
* When the user deletes a picture:
  * A remove request with the Amplify Storage API will delete the associated file from the AWS-S3 bucket.
  * An Apollo graphql mutation will destroy the record from the DynamoDB Pictures table.
  * The feed is refreshed to display the current pictures.
  
* When the user refreshes the feed:
  * An AppSync Client graphql query will request all the current pictures stored in the DynamoDB Pictures table.

