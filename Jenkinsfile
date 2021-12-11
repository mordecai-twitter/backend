node {
  stage('SCM') {
    checkout scm
  }
  stage('Test') {
    sh "ssh-keyscan -H azucena.cs.unibo.it >> ~/.ssh/known_hosts"
    sh "scp andrea.zecca3@azucena.cs.unibo.it:/home/web/site202137/html/.env ./"
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
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarQubeMordecai';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
  stage('Deploy') {
    sh "npm install --save"
    try {
      sh "ssh-keyscan -H azucena.cs.unibo.it >> ~/.ssh/known_hosts"
      sh "scp index.js andrea.zecca3@azucena.cs.unibo.it:/home/web/site202137/html"
      sh "scp server.js andrea.zecca3@azucena.cs.unibo.it:/home/web/site202137/html"
      sh "scp -r api/* andrea.zecca3@azucena.cs.unibo.it:/home/web/site202137/html/api"
    } catch (err1) {
      try {
        sh "ssh-keyscan -H marullo.cs.unibo.it >> ~/.ssh/known_hosts"
        sh "scp index.js andrea.zecca3@marullo.cs.unibo.it:/home/web/site202137/html"
        sh "scp server.js andrea.zecca3@marullo.cs.unibo.it:/home/web/site202137/html"
        sh "scp -r api/* andrea.zecca3@marullo.cs.unibo.it:/home/web/site202137/html/api"
      } catch (err2) {
        sh "ssh-keyscan -H ines.cs.unibo.it >> ~/.ssh/known_hosts"
        sh "scp index.js andrea.zecca3@ines.cs.unibo.it:/home/web/site202137/html"
        sh "scp server.js andrea.zecca3@ines.cs.unibo.it:/home/web/site202137/html"
        sh "scp -r api/* andrea.zecca3@ines.cs.unibo.it:/home/web/site202137/html/api"
      }
    }
  }
}
