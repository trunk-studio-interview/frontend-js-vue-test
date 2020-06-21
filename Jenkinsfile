pipeline {
    agent {
        label "jenkins-nodejs"
    }
    environment {
      ORG               = 'cargocms'
      APP_NAME          = 'cargocms-admin-client'
      CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
    }
    stages {
      stage('CI Build and push snapshot') {
        when {
          anyOf {
            branch 'PR-*';
            branch 'preview-*'
            branch 'develop'
          }
        }
        environment {
          PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
          PREVIEW_NAMESPACE = "$APP_NAME-$BRANCH_NAME".toLowerCase()
          HELM_RELEASE = "$PREVIEW_NAMESPACE".toLowerCase()
        }
        steps {
          container('nodejs') {
            // sh "npm install"
            // sh "CI=true DISPLAY=:99 npm test"
            sh 'export VERSION=$PREVIEW_VERSION && skaffold build -f skaffold.yaml'
            sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:$PREVIEW_VERSION"

          }
          dir ('./charts/preview') {
            container('nodejs') {
              sh "make preview"
              sh "jx preview --app $APP_NAME --namespace $PREVIEW_NAMESPACE --dir ../.."
            }
          }
        }
      }
      stage('Build Release') {
        when {
          branch 'staging'
        }
        steps {
          container('nodejs') {
            // ensure we're not on a detached head
            sh "git checkout staging"
            sh "git config --global credential.helper store"

            sh "jx step git credentials"
            // so we can retrieve the version in later steps
            sh "echo \$(jx-release-version) > VERSION"
          }

          dir ('./charts/cargocms-admin-client') {
            container('nodejs') {
              sh "make tag"
            }
          }
          container('nodejs') {
            // sh "npm install"
            // sh "CI=true DISPLAY=:99 npm test"

            sh 'export VERSION=`cat VERSION` && skaffold build -f skaffold.yaml'

            sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:\$(cat VERSION)"
          }
        }
      }
      stage('Promote to Environments') {
        when {
          branch 'staging'
        }
        steps {
          dir ('./charts/cargocms-admin-client') {
            container('nodejs') {
              sh 'jx step changelog --version v\$(cat ../../VERSION)'
              // release the helm chart
              sh 'jx step helm release'
              // promote through all 'Auto' promotion Environments
              sh 'jx promote -b --env staging --timeout 1h --version \$(cat ../../VERSION) --no-wait=true --no-poll=true'
            }
          }
        }
      }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            input """Pipeline failed.
We will keep the build pod around to help you diagnose any failures.

Select Proceed or Abort to terminate the build pod"""
        }
    }
  }
