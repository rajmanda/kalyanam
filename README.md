# Kalyanam

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# nav-bar component 
  https://www.youtube.com/watch?v=ADEZTrIxj1k
 

# Docker 
  docker build -t kalyanam:latest .
  docker run -d -p 4200:80 kalyanam:latest

# Create Deployment YAML 
kubectl create deployment kalyanam \
  --image=dockerrajmanda/kalyanam:25 \
  --port=4200 \
  --namespace=kalyanam \
  --dry-run=client -o yaml > kalyanam-deployment.yaml

# Nginx Crontroller. 
Ngnix Ingress Controller 

Install new helm repo
	helm repo add nginx-stable https://helm.nginx.com/stable
	helm repo update

Install ngnix controller with our reserved External IP as load balancer
	helm install nginx-ingress nginx-stable/nginx-ingress   --namespace ingress-nginx   --create-namespace   --set controller.service.loadBalancerIP=104.154.188.167   --set controller.debug.enable=false

Then create your ingress ...
  
