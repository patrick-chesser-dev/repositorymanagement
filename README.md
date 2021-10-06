# Repository Management Sample Project
This is a project demonstrating a simple serverless application that provides convenience functionality for management of public git repositories. The scope of this project is to simply provide an API that will allow a user to request the count of the number of open pull requests against a give public github repository. I have designed the application to make it flexible enough to allow for management of other repositories in the future, as well as made it easy to provide additional functionality.

## Architecture/Design Documents
### Context Diagram

#### Overview
We can see that the user is able to interact directly with our system, rather than going directly to the repository in question.
The system has been designed with the intention of being able to support multiple repositories, not just github. The system can act both as an Adapter, in that same request could work against multiple endpoints, without needing to know all of the specifics of how the underlying requests work; and as a system that could provide entirely new functionality, such as reporting. 

![Context Diagram](/design/images/Context.png)

### Component Diagram

#### Overview
While the potential usages of the system are broad, we are focusing on a very small slice of that potential. For version 1.0.0, we will focus exclusively on pull requests, specifically aggregating all open pull requests. We will implement this functionality against github, but will build out the infrastructure that will allow users to query against multiple repos, in addition to informing the users of which repos are supported. We will focus on public repos for now, so we will not need to support private repositories for this release.

![Component Diagram](/design/images/Component.png)

#### High Level Design
We will employ a serverless architecture, using AWS Cloud Native Tools: API Gateway, Lambda, and S3. 

**System**

The API Gateway will provide the rest endpoints the user will interact with. We will provide two get endpoints:
* An endpoint to inform the user of which repos are supported
  * This endpoint will be backed by its own lambda function that will simply return the list of supported repos, along with their expected url formats.
  *  The supported repos will be stored in the S3 bucket
  * This can change to another datastore at a later time if the list grows large, or we have performance issues, but should suffice for now
* An endpoint to get the number of open pull requests for a specific repo
  * The endpoint will accept a url of the repo in question
  * Determine if the repo is supported
  * And if so, return the open number of pull requests against the repo
  * This will also be backed by its own lambda

**Infrastructure/Deployment**

We will use the serverless framework to deploy the resources to AWS. For this use case we will manage the API Gateway and S3 Bucket in it's own cloud formation stack, and the Lambdas in a single cloud formation stack. This will allow us to manage the infrastructure and the lambdas independently of one another. 

We could do a stack per lambda, but as the system grows, we will run into resource constraints, and it can make managing the deployments more difficult. Serverless does a good job of making sure we don't "deploy over" a resource that hasn't changed, so we should still be able to manage small, quick deployments without introducing the risk of a standard "rolling deployment"