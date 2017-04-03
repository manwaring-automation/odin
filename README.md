[![Build Status][travis-badge]][travis-badge-url]
# Odin

Odin, or Wōtan, is a Norse god who directs the valkyries and is the guardian of Valhalla.  Half of those who perish in combat are welcomed by him into his majestic halls where they prepare for the final battle against Fenrir during the events of Ragnarök.

# What it does
This serverless application periodically checks the status of CloudFormation stacks in your AWS environment and sends the stale ones to Valhalla.

Odin currently determines that a stack is stale and should be removed with three criteria:

1. **Tagging:**  If a stack is tagged with the stage 'Production' or 'Automation' (or either's derivatives, like 'Prod' or 'Auto') then it is ineligible for deletion
1. **Status:**  If a stack's status is in a failure or in-progress state then it is ineligible for deletion
1. **Age:**  If a stack has been updated recently then it is ineligible for deletion

If a stack doesn't match one of the above criteria then it is removed.

# How to use it
Odin is built with the [Serverless Framework](https://serverless.com/) - see their documentation for more about the tool and how to use it.

To deploy Odin to your AWS environment simply use your favorite CI/CD tools (this project uses [Travis-CI](https://travis-ci.org/manwaring/odin)) or even deploy manually from your desktop using the command `sls deploy`.

Currently only stack age is configurable outside of the node code - steps 1 and 2 are written into the application logic in [stacks/check.js](https://github.com/manwaring/odin/blob/master/stacks/check.js).  To modify the frequency with which Odin checks for stale stacks as well as the length of time used to determine staleness you can update the schedule and input parameters defined for the CheckStacks function in [serverless.yml](https://github.com/manwaring/odin/blob/master/serverless.yml).  To modify the rules used for stage tags and stack status you will need to modify the helper methods in [stacks/check.js](https://github.com/manwaring/odin/blob/master/stacks/check.js).

# Limitations
Unlike his Norse namesake Odin is unable to practice magic and cannot remove stacks that aren't self-removing.

A common example of this situation is a stack which creates an S3 bucket that is later filled with files.  If the stack doesn't contain the resources necessary to empty and then delete this bucket any stack delete commands (whether triggered by Odin, manually, or any other means) will end with the stack in an error state.  Don't treat your stacks this way - let them enter Valhalla with honor!

For this specific scenario you can use a tool like the `empty-s3-bucket` service found in [Lambda Utilities](https://github.com/manwaring/lambda-utilities) in combination with a custom CloudFormation resource to empty buckets when a stack is deleted.  See the infrastructure section of [Santa Swap UI](https://github.com/santaswap/ui) for a real-world example of how this can be achieved.

An exception to this rule are the deployment buckets created by the [Serverless Framework](https://serverless.com/) - Odin will check for the deployment bucket's name in the CloudFormation stack's output, and that bucket will be emptied before the delete stack command is called.

# Architecture Overview
![odin - architecture overview](https://cloud.githubusercontent.com/assets/2955468/24622124/d93b2774-1871-11e7-8ba7-afecb7f50e63.png)

[travis-badge]: https://travis-ci.org/manwaring/odin.svg?branch=master		
[travis-badge-url]: https://travis-ci.org/manwaring/odin
