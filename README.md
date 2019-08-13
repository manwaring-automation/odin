<p align="center">
  <img height="150" src="https://avatars0.githubusercontent.com/u/36457275?s=400&u=16d355f384ed7f8e0655b7ed1d70ff2e411690d8&v=4e">
  <img height="150" src="https://user-images.githubusercontent.com/2955468/44294549-01c7c280-a267-11e8-9fbf-4c3788eb4635.jpg">
  
</p>

[![build]][build-url] [![coverage]][coverage-url] [![dependabot]][dependabot-url] [![dependencies]][dependencies-url] [![dev-dependencies]][dev-dependencies-url] [![license]][license-url]

# Odin

Odin, or Wōtan, is a Norse god who directs the valkyries and is the guardian of Valhalla. Half of those who perish in combat are welcomed by him into his majestic halls where they prepare for the final battle against Fenrir during the events of Ragnarök.

# What it does

This serverless application periodically checks the status of CloudFormation stacks in your AWS environment and sends the stale ones to Valhalla.

Odin currently determines that a stack is stale and should be removed when it doesn't fit any of the following three criteria:

1.  **Tagging:** If a stack is tagged with the stage 'Production' or 'Automation' (or derivatives like 'Prod' or 'Auto') then it is ineligible for deletion
1.  **Status:** If a stack's status is in a failure or in-progress state then it is ineligible for deletion
1.  **Age:** If a stack has been updated recently then it is ineligible for deletion

If a stack doesn't match one of the above criteria then it is removed.

# How to use it

Odin is built with the [Serverless Framework](https://serverless.com/) - see their documentation for more about the tool and how to use it.

To change the frequency with which Odin runs and the settings used to determine whether a stack is eligible for deletion modify the values in [odin.yml](https://github.com/manwaring/odin/blob/master/odin.yml) and redeploy the application.

# Limitations

Unlike his Norse namesake Odin is unable to practice magic and cannot remove stacks that aren't self-removing.

A common example of this situation is a stack which creates an S3 bucket that is later filled with files. If the stack doesn't contain the resources necessary to empty and then delete this bucket any stack delete commands (whether triggered by Odin, manually, or any other means) will end with the stack in an error state. Don't treat your stacks this way - let them enter Valhalla with honor!

For this specific scenario you can use a tool like the `empty-s3-bucket` service found in [Lambda Utilities](https://github.com/manwaring/lambda-utilities) in combination with a custom CloudFormation resource to empty buckets when a stack is deleted. See the infrastructure section of [Santa Swap UI](https://github.com/santaswap/ui) for a real-world example of how this can be achieved within a stack.

Another approach is to let Odin empty your S3 buckets for you prior to calling the delete stack command. This approach requires you to output the bucket name in your CloudFormation stack, and then add the output key name to [odin.yml](https://github.com/manwaring/odin/blob/master/odin.yml). By default Odin will empty the deployment buckets created by the [Serverless Framework](https://serverless.com/).

# Architecture overview

![odin - architecture overview](https://cloud.githubusercontent.com/assets/2955468/24622720/f24c75a4-1873-11e7-9e09-b83a1425c196.png)

## Odin image source

Murray, Alexander (1874). Manual of Mythology : Greek and Roman, Norse, and Old German, Hindoo and Egyptian Mythology. London, Asher and Co. This illustration is from plate XXXV. Digitized version of the book by the Internet Archive, https://archive.org/details/manualofmytholog00murruoft Published earlier in Reusch, Rudolf Friedrich. 1865. Die nordischen Göttersagen.

<!-- badge icons -->

[build]: https://flat.badgen.net/circleci/github/manwaring/odin/master/?icon=circleci
[coverage]: https://flat.badgen.net/codecov/c/github/manwaring/odin/?icon=codecov
[dependencies]: https://flat.badgen.net/david/dep/manwaring/odin
[dev-dependencies]: https://flat.badgen.net/david/dev/manwaring/odin/?label=dev+dependencies
[license]: https://flat.badgen.net/github/license/manwaring/serverless-starter
[dependabot]: https://flat.badgen.net/dependabot/manwaring/odin/?icon=dependabot&label=dependabot

<!-- badge urls -->

[build-url]: https://circleci.com/gh/manwaring/odin
[coverage-url]: https://codecov.io/gh/manwaring/odin
[dependencies-url]: https://david-dm.org/manwaring/odin
[dev-dependencies-url]: https://david-dm.org/manwaring/odin?type=dev
[license-url]: https://github.com/manwaring/odin
[dependabot-url]: https://flat.badgen.net/dependabot/manwaring/serverless-starter
