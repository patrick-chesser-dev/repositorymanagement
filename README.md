# Repository Management Sample Project
This is a project demonstrating a simple serverless application that provides convenience functionality for management of public git repositories. The scope of this project is to simply provide an API that will allow a user to request the count of the number of open pull requests against a given public github repository. I have designed the application to make it flexible enough to allow for management of other repositories in the future, as well as made it easy to provide additional functionality.

## Architecture/Design Documents
### Context Diagram

#### Overview
We can see that the user is able to interact directly with our system, rather than going directly to the repository in question.
The system has been designed with the intention of being able to support multiple repositories, not just github. The system can act both as an Adapter, in that same request could work against multiple endpoints, without needing to know all of the specifics of how the underlying requests work; and as a system that could provide entirely new functionality, such as reporting. 

![Context Diagram](/design/images/Context.png)

### Container Diagram
![Container Diagram](/design/images/Container.png)

### Component Diagram

#### Overview
While the potential usages of the system are broad, we are focusing on a very small slice of that potential. For version 1.0.0, we will focus exclusively on pull requests, specifically aggregating all open pull requests. We will implement this functionality against github, but will build out the infrastructure that will allow users to query against multiple repos, in addition to informing the users of which repos are supported. We will focus on public repos for now, so we will not need to support private repositories for this release.

![Component Diagram](/design/images/Component.png)

#### High Level Design
We will employ a serverless architecture, using AWS Cloud Native Tools: API Gateway, Lambda, and S3. 

**System**

The API Gateway will provide the rest endpoints the user will interact with. We will provide two get endpoints:
* An endpoint exposing a GET request against pull requests
  * The endpoint will accept a url of the repo in question
    * e.g. https://github.com/patrick-chesser-dev/repositorymanagement
  * Determine if the repo is supported
    * Only github supported for this release
  * Determine what to return, based on query string input
    * status (representing the status of a PR)
      * only a status of "open" will be supported at this time
    * countonly (letting the service know if only a count is required)
      * only a countonly of "true" will be supported at this time
    * The implementation should be flexible enough to allow for other types of queries in the future

## Infrastructure/Deployment

We will use the serverless framework to deploy the resources to AWS. For this use case we will manage the API Gateway its own cloud formation stack, and the pull-requests service in a single cloud formation stack. This will allow us to manage the infrastructure and the lambdas independently of one another. 

We could do a stack per lambda, but as the system grows, we will run into resource constraints, and it can make managing the deployments more difficult. Serverless does a good job of making sure we don't "deploy over" a resource that hasn't changed, so we should still be able to manage small, quick deployments without introducing the risk of a standard "rolling deployment". Serverless is smart enough to update only the Lambdas that have changed.

**How to deploy**
1. Ensure you have default .aws credentials, with permissions to create API Gateway, Cloudwatch, and Lambda Resources
2. Deploy the API Gateway
   1. > cd aws-infrastructure/api-gateway
   2. serverless deploy --stage {stageYouWishToDeploy} --region {regionYouWishToDeployTo} example:
      1. > serverless deploy --stage dev --region us-west-2
3. Deploy the pull-requests Lambada
   1. > cd aws-infrastructure/lambda
   2. Run the deploy.sh script
      1. if file permission revert on a *nix system, be sure to chmod +x the file
      2. the script requires two arguments, the first is the stage, the second is the region. Example
      3. > ./deploy.sh dev us-west-2

## Calling the Endpoint
The service was designed to be flexible and (eventually) allow support for multiple hosts, not just github. Additionally, it was designed to eventually allow support for querying not just the count of pull requests, but returning the pull requests as well. Finally, it was  also designed to allow for additional statuses, not just open.

Since the current requirement for this project is to support getting the number of open pull requests, that is the only data that the system will allow the user to request. As such, url will need to be in the below format:
> {apiGatewayHost}/v1/pullrequests?sourceurl={githubRepoUrl}&status=open&countonly=true

Any other format will result in an error response. 

### About the URL Format
I went back and forth on using query params vs pathing in the URL. For instance, I could have done something like this:
v1/{repoHost}/{repoUser}/{repoName}/pullrequests/

However, I felt this could prove inflexible if there were different ways a repo is tracked in a new system.

