node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarQubeMordecai';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
  stage('Test') {
    try {
      sh "npm install --save"
    } catch (err) {
        echo "Failed: ${err}"
    }
    try {
      sh "yarn install"
    } catch (err) {
        echo "Failed: ${err}"
    }
    try {
      sh "npm test"
    }   catch (err) {
        echo "Failed: ${err}"
    }
  }
  stage('Deploy') {
    sh "ssh-keyscan -H donprocopio.cs.unibo.it >> ~/.ssh/known_hosts"
    sh "npm install --save"
    sh "scp index.js andrea.zecca3@donprocopio.cs.unibo.it:/home/web/site202137/html"
    sh "scp -r api/* andrea.zecca3@donprocopio.cs.unibo.it:/home/web/site202137/html/api"
  }
}
