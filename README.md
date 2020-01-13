<p align="center">
  <img height="150" src="https://avatars0.githubusercontent.com/u/36457275?s=400&u=16d355f384ed7f8e0655b7ed1d70ff2e411690d8&v=4e">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/44294549-01c7c280-a267-11e8-9fbf-4c3788eb4635.jpg">
  
</p>

[![build]][build-url] [![coverage]][coverage-url] [![dependabot]][dependabot-url] [![dependencies]][dependencies-url] [![dev-dependencies]][dev-dependencies-url] [![license]][license-url]

# Odin

Odin, or Wōtan, is a Norse god who directs the valkyries and is the guardian of Valhalla. Half of those who perish in combat are welcomed by him into his majestic halls where they prepare for the final battle against Fenrir during the events of Ragnarök.

This serverless application periodically checks the status of CloudFormation stacks in the AWS account and region where it is deployed to and sends the stale, removable ones to Valhalla.

# What it does

Odin currently determines that a stack is stale and should be removed when it's current state matches the following three criteria:

1.  **Tagging:** If a stack is _not_ tagged with any of the stages specified as permanent in [odin.yml](odin.yml) then it is _eligible_ for removal
1.  **Status:** If a stack's status is _not_ one of those specified as deletable in [odin.yml](odin.yml) then it is _eligible_ for removal
1.  **Age:** If a stack has _not_ been updated within the timeframes specified in [odin.yml](odin.yml) then it is _eligible_ for removal

# How to use it

Odin is built with the [Serverless Framework](https://serverless.com/framework/docs/) - see their documentation for more about the tool and how to use it.

To change the frequency with which Odin runs and the settings used to determine whether a stack is eligible for deletion modify the values in [odin.yml](odin.yml) and redeploy the application.

## Lumigo setup & configuration

This application is currently setup with [Lumigo](https://lumigo.io/) as a serverless monitoring and logging solution. To package and deploy the application with the Lumigo integration you'll need to setup an account and provide a Lumigo access token as environment variable in a local `.env` file:

```
LUMIGO_TOKEN=<token>
```

Instructions for [setting up your Lumigo account](https://docs.lumigo.io/docs) and [configuring the Lumigo serverless plugin](https://github.com/lumigo-io/serverless-lumigo-plugin).

Or just comment out the Lumigo plugin in `serverless.yml`, and optionally comment out the Lumigo-specific configurations if you don't wish to include the integration:

```yml
plugins:
  - serverless-webpack
  - serverless-cloudformation-resource-counter
  - serverless-plugin-iam-checker
  - serverless-plugin-test-helper
  - serverless-prune-plugin
  # - serverless-lumigo

# (commenting out the custom config is optional)
custom:
  ...
  # https://github.com/lumigo-io/serverless-lumigo-plugin
  # lumigo:
  # token: ${env:LUMIGO_TOKEN}
  # nodePackageManager: npm
```

# Limitations

Unlike his Norse namesake Odin is unable to practice magic and cannot remove stacks that aren't self-removing.

A common example of this situation is a stack which creates an S3 bucket that is later filled with files. If the stack doesn't contain the custom resources necessary to empty and then delete this bucket any stack delete commands (whether triggered by Odin, manually, or any other means) will end with the stack in an error state. Don't treat your stacks this way - let them enter Valhalla with honor!

To help with this, by default Odin will empty all S3 buckets in a stack prior to calling the delete stack command. You can either disable bucket emptying entirely or specify specific buckets to be emptied in the [odin.yml](odin.yml) config file.

# Architecture overview

![odin - architecture overview](https://cloud.githubusercontent.com/assets/2955468/24622720/f24c75a4-1873-11e7-9e09-b83a1425c196.png)

# Default Odin configurations

```yml
# This schedule initiates Odin once a day in the early morning (US ET) to
# clean up ephemeral stages
daily:
  rate: cron(0 8 ? * * *) # 8 AM UTC / 3 AM ET
  staleAfter: 2 # delete if older than 2 hours

# This schedule initiates Odin every hour to clean up ephemeral stages
hourly:
  rate: cron(0 */1 ? * * *) # every hour
  staleAfter: 8 # delete if older than 8 hours

# Odin won't delete a stack with the following names or stages - this behavior is consistent for both schedules
namesToRetain: "[\/ControlTower\/,'AWSControlTowerBP-BASELINE-CLOUDTRAIL-MASTER']" # Supports partial matches - casing matters
stagesToRetain: "['PROD', 'PRODUCTION', 'QA', 'DEVELOPMENT', 'DEV', 'AUTO', 'AUTOMATION', 'INFRA', 'INFRASTRUCTURE', 'COMMON']"

# Odin will only delete a stack if it's status is one of the following - this behavior is consistent for both schedules
deleteableStatuses: "['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE']"

# A CloudFormation stack won't delete successfully if there are non-empty
# buckets associated with it.  Use this property to indicate whether or
# not you want Odin to empty all buckets in the stack (default behavior).
# If you only want odin to empty specific buckets then set this property
# to false and update the bucketsToEmpty property below with the logical
# resource names of the buckets you want Odin to empty.  This behavior is
# consistent for both schedules
emptyAllBuckets: true

# The CloudFormation logical resource names of buckets to empty (if you don't want to empty all buckets by default)
# This behavior is consistent for both schedules
bucketsToEmpty: "['ServerlessDeploymentBucket', 'DocumentBucket', 'S3BucketSite', 'ApiDocumentationBucket']"
```

Config specifications can be found (and modified) in [odin.yml](odin.yml)

## Odin image source

Murray, Alexander (1874). Manual of Mythology : Greek and Roman, Norse, and Old German, Hindoo and Egyptian Mythology. London, Asher and Co. This illustration is from plate XXXV. Digitized version of the book by the Internet Archive, https://archive.org/details/manualofmytholog00murruoft Published earlier in Reusch, Rudolf Friedrich. 1865. Die nordischen Göttersagen.

<!-- badge icons -->

[build]: https://flat.badgen.net/circleci/github/manwaring/odin/master/?icon=circleci
[coverage]: https://flat.badgen.net/codecov/c/github/manwaring/odin/?icon=codecov
[dependencies]: https://flat.badgen.net/david/dep/manwaring/odin
[dev-dependencies]: https://flat.badgen.net/david/dev/manwaring/odin/?label=dev+dependencies
[license]: https://flat.badgen.net/github/license/manwaring/odin
[dependabot]: https://flat.badgen.net/dependabot/manwaring/odin/?icon=dependabot&label=dependabot

<!-- badge urls -->

[build-url]: https://circleci.com/gh/manwaring/odin
[coverage-url]: https://codecov.io/gh/manwaring/odin
[dependencies-url]: https://david-dm.org/manwaring/odin
[dev-dependencies-url]: https://david-dm.org/manwaring/odin?type=dev
[license-url]: https://github.com/manwaring/odin
[dependabot-url]: https://flat.badgen.net/dependabot/manwaring/odin
