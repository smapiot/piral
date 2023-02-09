---
title: AWS Amplify
description: How to deploy your Piral instance to the web using AWS.
---

# ![AWS Logo](../logos/aws-amplify.svg){height=24px .auto} Deploy your Piral instance to AWS

[AWS](https://aws.amazon.com/) is a full-featured web app hosting platform that can be used to deploy an Piral instance.

Deploying your project to AWS requires using the [AWS console](https://aws.amazon.com/console/). Most of these actions can also be done using the [AWS CLI](https://aws.amazon.com/cli/).

This guide will walk you through the steps to deploy your site to AWS starting with the most basic method. Then, it will demonstrate adding additional services to improve cost efficiency and performance.

## AWS Amplify

AWS Amplify is a set of purpose-built tools and features that lets frontend web and mobile developers quickly and easily build full-stack applications on AWS.

1. Create a new Amplify Hosting project.
2. Connect your repository to Amplify.
3. Modify your build output directory `baseDirectory` to `/dist/release`.

    ```yaml
    version: 1
    frontend:
      phases:
        preBuild:
          # Not using npm? Change `npm ci` to `yarn install` or `pnpm i`
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: /dist/release
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*

    ```

Amplify will automatically deploy your website and update it when you push a commit to your repository.

## S3 static website hosting

S3 is the starting point of any application. It is where your project files and other assets are stored. S3 charges for file storage and number of requests. You can find more information about S3 in the [AWS documentation](https://aws.amazon.com/s3/).

1. Create an S3 bucket with your project's name.

    ::: tip: Unique bucket name
    The bucket name should be globally unique. We recommend a combination of your project name and the domain name of your site.
    :::

2. Disable **"Block all public access"**. By default, AWS sets all buckets to be private. To make it public, you need to uncheck the "Block public access" checkbox in the bucket's properties.
3. Upload your built files located in `dist/release` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command after [authenticating with your AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```sh
    aws s3 cp dist/release s3://<BUCKET_NAME>/ --recursive
    ```

4. Update your bucket policy to allow public access. You can find this setting in the bucket's **Permissions > Bucket policy**.

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::<BUCKET_NAME>/*"
        }
      ]
    }
    ```

    ::: warning: Caution
    Do not forget to replace `<BUCKET_NAME>` with the name of your bucket.
    :::

5. Enable website hosting for your bucket. You can find this setting in the bucket's **Settings > Static website hosting**. Set your index document to `index.html` and your error document to `index.html`, too. Finally, you can find your new website URL in the bucket's **Settings > Static website hosting**.

## S3 with CloudFront

CloudFront is a web service that provides content delivery network (CDN) capabilities. It is used to cache content of a web server and distribute it to end users. CloudFront charges for the amount of data transferred. Adding CloudFront to your S3 bucket is more cost-effective and provides a faster delivery.

We will use CloudFront to wrap our S3 bucket to serve our project's files using Amazon global CDN network. This will reduce the cost of serving your project's files and will increase the performance of your site.

### S3 setup

1. Create an S3 bucket with your project's name.

    ::: tip: Unique bucket name
    The bucket name should be globally unique. We recommend a combination of your project name and the domain name of your site.
    :::

2. Upload your built files located in `dist/release` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command after [authenticating with your AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```sh
    aws s3 cp dist/release s3://<BUCKET_NAME>/ --recursive
    ```

3. Update your bucket policy to allow **CloudFront Access**. You can find this setting in the bucket's **Permissions > Bucket policy**.

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <CLOUDFRONT_OAI_ID>"
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::piral-aws/*"
      }]
    }
    ```

    ::: warning: Caution
    Do not forget to replace `<CLOUDFRONT_OAI_ID>` with the name of your CloudFront Origin Access Identity ID. You can find the CloudFront Origin Access Identity ID in **CloudFront > Origin access identities** after setting up CloudFront.
    :::

### CloudFront setup

Create a CloudFront distribution with the following values:

- **Origin domain:** Your S3 bucket
- **S3 bucket access:** "Yes use OAI (bucket can restrict access to only CloudFront)"
- **Origin access identity:** Create a new origin access identity
- **Viewer - Bucket policy:** "No, I will update the bucket policy"
- **Viewer protocol policy:** "Redirect to HTTPS"
- **Default root object:** `index.html`

This configuration will block access to your S3 bucket from the public internet and serve your site using the global CDN network. You can find your CloudFront distribution URL in the bucket's **Distributions > Domain name**.

### CloudFront Functions setup

Unfortunately, CloudFront does not support multi-page `sub-folder/index` routing by default. To configure it, we will use CloudFront Functions to point the request to the desired object in S3.

1. Create a new CloudFront function with the following code snippet. You can find CloudFront functions in **CloudFront > Functions**.

    ```js
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Check whether the URI is missing a file name.
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      }
      // Check whether the URI is missing a file extension.
      else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
    ```

2. Attach your function to the CloudFront distribution. You can find this option in your CloudFront distribution's **Settings > Behaviors > Edit > Function** associations.

    - **Viewer request - Function type:** CloudFront Function.
    - **Viewer request - Function ARN:** Select the function you created in the previous step.

## Continuous deployment with GitHub Actions

There are many ways to set up continuous deployment for AWS. One possibility for code hosted on GitHub is to use [GitHub Actions](https://github.com/features/actions) to deploy your website every time you push a commit.

1. Create a new policy in your AWS account using [IAM](https://aws.amazon.com/iam/) with the following permissions. This policy will allow you to upload built files to your S3 bucket and invalidate the CloudFront distribution files when you push a commit.

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "VisualEditor0",
              "Effect": "Allow",
              "Action": [
                  "s3:PutObject",
                  "s3:ListBucket",
                  "cloudfront:CreateInvalidation"
              ],
              "Resource": [
                  "<DISTRIBUTION_ARN>",
                  "arn:aws:s3:::<BUCKET_NAME>/*",
                  "arn:aws:s3:::<BUCKET_NAME>"
              ]
          }
      ]
    }
    ```

    ::: warning: Caution
    Do not forget to replace `<DISTRIBUTION_ARN>` and `<BUCKET_NAME>`. You can find the ARN in **CloudFront > Distributions > Details**.
    :::

2. Create a new IAM user and attach the policy to the user. This will provide your `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID`.
3. Add this sample workflow to your repository at `.github/workflows/deploy.yml` and push it to GitHub. You will need to add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET_ID`, and `DISTRIBUTION_ID` as “secrets” to your repository on GitHub under **Settings** > **Secrets** > **Actions**. Click `New repository secret` to add each one.

    ```yaml
    name: Deploy Website

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v3
          - name: Configure AWS Credentials
            uses: aws-actions/configure-aws-credentials@v1
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: us-east-1
          - name: Install modules
            run: npm ci
          - name: Build application
            run: npm run build
          - name: Deploy to S3
            run: aws s3 sync ./dist/release s3://${{ secrets.BUCKET_ID }}
          - name: Create CloudFront invalidation
            run: aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
    ```

    ::: tip: Note
    Your `BUCKET_ID` is the name of your S3 bucket. Your `DISTRIBUTION_ID` is your CloudFront distribution ID. You can find your CloudFront distribution  ID in **CloudFront > Distributions > ID**
    :::
