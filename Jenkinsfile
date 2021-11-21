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
  stage('Deploy') {
    sh "ssh-keyscan -H marullo.cs.unibo.it >> ~/.ssh/known_hosts"
    sh "nom install --save"
    sh "scp index.js andrea.zecca3@marullo.cs.unibo.it:/home/web/site202137/html"
    sh "scp -r api/* andrea.zecca3@marullo.cs.unibo.it:/home/web/site202137/html/api"
  }
}
