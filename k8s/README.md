# Business Create UI

## How to build the openshift environment

### Images
This repo has implemented github actions to build and push the new image into our *tools* environment in OpenShift when a PR is merged. The significance in the OpenShift environment is there's no need for a build config or build pipeline.

You will still need to build the image stream (`oc create imagestream <name>`) and create tags for *dev, test, test-previous, prod and prod-previous* (`oc tag <namespace-tools>/<image name>:<source> <namespace-tools>/<image name>:<destination>`)

### Deployment Objects
There are 5 objects you need to create in OpenShift for the UI to run: deployment config, service, route, config map and keycloak config map. By updating the param file values in *bcrs-business-create-ui.dc-srvc-rt-cmap.param* to what you need for the OpenShift environment and running `oc process -f templates/business-create-ui.dc-srvc-rt-cmap-kcmap.json --param-file=business-create-ui.dc-srvc-rt-cmap-kcmap.param  | oc create -f -` you will create all 5 objects.

### Build the test/prod pipelines

1. **Setup parameters** Alter, or copy the *bcrs-entities-create-ui-build-pipeline.param* updating the values for your pipeline.
2. **Create the pipeline** process the template referencing your parameter file. `oc process -f templates/business-create-ui.pipeline.json --param-file=business-create-ui.pipeline.param  | oc create -f -`
3. **Create the Jenkinsfile** this is the code that the pipeline runs. In the Jenkisnfile folder for this repo there should be 3 groovy files *deploy-dev.groovy*, *deploy-test.groovy* and *deploy-prod.groovy*. These should contain code to tag the current image of the environment to -previous and then tag the source image to the current image. Next it should verify that the new image tag triggered a new deployment. Finally, it should run any automated integration tests and report if they succeed or not.

## Updating OpenShift Environment

To update one of the OpenShift objects (such as a config map or deployment config):

1. **update the template** Alter the template containing all the objects (business-create-ui.dc-srvc-rt-cmap-kcmap.json)
2. **update the param file** Add/delete the changes you need to the params to the `business-create-ui.dc-srvc-rt-cmap-kcmap.param` file. Also update the values for each param corresponding to the environment you are updating in OpenShift
##### NOTE: Do not commit the new values for the parameters into GitHub (this is viewable to the public), but do commit the new parameters so that the next person knows which values they need to look up for updating the object
3. **update the object in OpenShift** Run the oc command over the environment you are updating `oc process -f templates/business-create-ui.dc-srvc-rt-cmap-kcmap.json --param-file=business-create-ui.dc-srvc-rt-cmap-kcmap.param  | oc replace -f -`